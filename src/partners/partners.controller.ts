import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
  Req,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SendPartnerRequestDto } from './dtos/send-partner-request.dto';

@Controller('partners')
@UseGuards(JwtAuthGuard)
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  // POST /partners/requests/:receiverId
  @Post('requests/:receiverId')
  sendPartnerRequest(
    @Param('receiverId', ParseIntPipe) receiverId: number,
    @Body() dto: SendPartnerRequestDto,
    @Req() req: any,
  ) {
    const senderId = req.user?.id; // assumes your JWT payload sets req.user.id
    return this.partnersService.sendRequest(receiverId, senderId, dto);
  }
  // POST /partners/requests/:requestId/accept
  @Post('requests/:requestId/accept')
  acceptPartnerRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Req() req: any,
  ) {
    const receiverId = req.user?.id; // the user accepting the request
    return this.partnersService.acceptRequest(requestId, receiverId);
  }

  @Delete(':partnerId')
  removePartner(
    @Param('partnerId', ParseIntPipe) partnerId: number,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.partnersService.removePartner(userId, partnerId);
  }
  @Get()
  async getMyPartners(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const userId = req.user.id; // assuming JWT auth guard sets req.user
    return this.partnersService.getMyPartners(userId, +page, +limit);
  }

  @Get('suggestions')
  async getSuggestions(@Req() req) {
    return this.partnersService.getSuggestions(req.user.id);
  }

  // GET /partners/requests/received?page=1&limit=10
  @Get('requests/received')
  async getReceivedRequests(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const userId = req.user.id;
    return this.partnersService.getReceivedRequests(userId, +page, +limit);
  }

  // POST /partners/requests/:requestId/reject
  @Post('requests/:requestId/reject')
  rejectPartnerRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Req() req: any,
  ) {
    const receiverId = req.user?.id;
    return this.partnersService.rejectRequest(requestId, receiverId);
  }
}
