import {
  Controller,
  Injectable,
  UseGuards,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Put,
  Get,
  Param,
  Query,
  Request,
  UseInterceptors,
  HttpException
} from '@nestjs/common';
import {
  DataResponse,
  PageableData,
  getConfig,
  ForbiddenException
} from 'src/kernel';
import { AuthService, Roles } from 'src/modules/auth';
import { RoleGuard, LoadUser } from 'src/modules/auth/guards';
import { CurrentUser } from 'src/modules/auth/decorators';
import {
  FileUploadInterceptor, FileUploaded, FileDto
} from 'src/modules/file';
import { REF_TYPE } from 'src/modules/file/constants';
import { FileService } from 'src/modules/file/services';
import { UserDto } from 'src/modules/user/dtos';
import { CountryService } from 'src/modules/utils/services';
import { PERFORMER_STATUSES } from '../constants';
import {
  PerformerDto, IPerformerResponse
} from '../dtos';
import {
  SelfUpdatePayload, PerformerSearchPayload, BankingSettingPayload, PaymentGatewaySettingPayload
} from '../payloads';
import { PerformerService, PerformerSearchService } from '../services';

@Injectable()
@Controller('performers')
export class PerformerController {
  constructor(
    private readonly performerService: PerformerService,
    private readonly performerSearchService: PerformerSearchService,
    private readonly authService: AuthService,
    private readonly countryService: CountryService,
    private readonly fileService: FileService
  ) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  async me(@Request() req: any): Promise<DataResponse<IPerformerResponse>> {
    const user = await this.performerService.getDetails(req.user._id, req.jwToken);
    return DataResponse.ok(new PerformerDto(user).toResponse(true, false));
  }

  @Get('/search')
  @UseGuards(LoadUser)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async usearch(
    @Query() query: PerformerSearchPayload,
    @Request() req: any,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<PageableData<IPerformerResponse>>> {
    let ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (ipClient.substr(0, 7) === '::ffff:') {
      ipClient = ipClient.substr(7);
    }
    // const ipClient = '115.75.211.252';
    const whiteListIps = ['127.0.0.1', '0.0.0.1'];
    let countryCode = null;
    if (whiteListIps.indexOf(ipClient) === -1) {
      const userCountry = await this.countryService.findCountryByIP(ipClient) as any;
      if (userCountry?.status === 'success' && userCountry?.countryCode) {
        countryCode = userCountry.countryCode;
      }
    }
    const data = await this.performerSearchService.search(query, user, countryCode);
    return DataResponse.ok(data);
  }

  @Put('/:id')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Body() payload: SelfUpdatePayload,
    @Param('id') performerId: string,
    @Request() req: any
  ): Promise<DataResponse<IPerformerResponse>> {
    await this.performerService.selfUpdate(performerId, payload);
    const performer = await this.performerService.getDetails(performerId, req.jwToken);
    if (payload.password) {
      await Promise.all([
        performer.email && this.authService.create({
          source: 'performer',
          sourceId: performer._id,
          type: 'email',
          key: performer.email,
          value: payload.password
        }),
        performer.username && this.authService.create({
          source: 'performer',
          sourceId: performer._id,
          type: 'username',
          key: performer.username,
          value: payload.password
        })
      ]);
    }
    return DataResponse.ok(new PerformerDto(performer).toResponse(true, false));
  }

  @Get('/:username')
  @UseGuards(LoadUser)
  @HttpCode(HttpStatus.OK)
  async getDetails(
    @Param('username') performerUsername: string,
    @Request() req: any,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<Partial<PerformerDto>>> {
    let ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (ipClient.substr(0, 7) === '::ffff:') {
      ipClient = ipClient.substr(7);
    }
    // const ipClient = '115.75.211.252';
    const whiteListIps = ['127.0.0.1', '0.0.0.1'];
    let countryCode = null;
    if (whiteListIps.indexOf(ipClient) === -1) {
      const userCountry = await this.countryService.findCountryByIP(ipClient) as any;
      if (userCountry?.status === 'success' && userCountry?.countryCode) {
        countryCode = userCountry.countryCode;
      }
    }
    const performer = await this.performerService.findByUsername(
      performerUsername,
      countryCode,
      user
    );

    if (!performer || performer.status !== PERFORMER_STATUSES.ACTIVE) {
      throw new HttpException('This account is suspended', 422);
    }

    return DataResponse.ok(performer.toPublicDetailsResponse());
  }

  @Post('/documents/upload')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileUploadInterceptor('performer-document', 'file', {
      destination: getConfig('file').documentDir
    })
  )
  async uploadPerformerDocument(
    @CurrentUser() currentUser: UserDto,
    @FileUploaded() file: FileDto,
    @Request() req: any
  ): Promise<any> {
    await this.fileService.addRef(file._id, {
      itemId: currentUser._id,
      itemType: REF_TYPE.PERFORMER
    });
    return DataResponse.ok({
      ...file,
      url: `${file.getUrl()}?documentId=${file._id}&token=${req.jwToken}`
    });
  }

  @Put('/:id/payment-gateway-settings')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  async updatePaymentGatewaySetting(
    @Body() payload: PaymentGatewaySettingPayload
  ) {
    const data = await this.performerService.updatePaymentGateway(payload);
    return DataResponse.ok(data);
  }

  @Post('/avatar/upload')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    FileUploadInterceptor('avatar', 'avatar', {
      destination: getConfig('file').avatarDir,
      generateThumbnail: true,
      replaceByThumbnail: true,
      thumbnailSize: getConfig('image').avatar
    })
  )
  async uploadPerformerAvatar(
    @FileUploaded() file: FileDto,
    @CurrentUser() performer: PerformerDto
  ): Promise<any> {
    // TODO - define url for perfomer id if have?
    await this.performerService.updateAvatar(performer, file);
    return DataResponse.ok({
      ...file,
      url: file.getUrl()
    });
  }

  @Post('/cover/upload')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    FileUploadInterceptor('cover', 'cover', {
      destination: getConfig('file').coverDir,
      generateThumbnail: true,
      thumbnailSize: getConfig('image').coverThumbnail
    })
  )
  async uploadPerformerCover(
    @FileUploaded() file: FileDto,
    @CurrentUser() performer: PerformerDto
  ): Promise<any> {
    // TODO - define url for perfomer id if have?
    await this.performerService.updateCover(performer, file);
    return DataResponse.ok({
      ...file,
      url: file.getUrl()
    });
  }

  @Post('/welcome-video/upload')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    FileUploadInterceptor('performer-welcome-video', 'welcome-video', {
      destination: getConfig('file').videoDir
    })
  )
  async uploadPerformerVideo(
    @FileUploaded() file: FileDto,
    @CurrentUser() performer: PerformerDto
  ): Promise<any> {
    // TODO - define url for perfomer id if have?
    await this.performerService.updateWelcomeVideo(performer, file);
    return DataResponse.ok({
      ...file,
      url: file.getUrl()
    });
  }

  @Put('/:id/banking-settings')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  async updateBankingSetting(
    @Param('id') performerId: string,
    @Body() payload: BankingSettingPayload,
    @CurrentUser() user: UserDto
  ) {
    const data = await this.performerService.updateBankingSetting(
      performerId,
      payload,
      user
    );
    return DataResponse.ok(data);
  }

  @Get('/documents/auth/check')
  @HttpCode(HttpStatus.OK)
  async checkAuth(
    @Request() req: any
  ) {
    if (!req.query.token) throw new ForbiddenException();
    const user = await this.authService.getSourceFromJWT(req.query.token);
    if (!user) {
      throw new ForbiddenException();
    }
    const valid = await this.performerService.checkAuthDocument(req, user);
    return DataResponse.ok(valid);
  }
}
