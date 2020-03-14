import { Controller, Post, Body, HttpException, HttpStatus, Get, Param, Query, Req } from '@nestjs/common';

import { InquiryService } from './inquiry.service';
import { Inquiry } from './Inquiry';
import { CreateInquiryDto, ICreateInquiryDto } from '../dto/CreateInquiryDto';
import { IInquiryListParams, InquiryListParams, IInquiryListParamsRequest } from '../dto/InquiryListParams';
import { IRequest } from 'src/Request';

export enum Routes {
    ATTEND = '/inquiries/:id/attend',
    CREATE = '/inquiries',
    GET = '/inquiries',
    SOLVE = '/inquiries/:id/solve',
    UNATTEND = '/inquiries/:id/unattend',
}

@Controller()
export class InquiryController {
    constructor(
        private readonly inquiryService: InquiryService
    ) {}

    @Post(Routes.CREATE)
    create(
        @Body() body: ICreateInquiryDto
    ): Promise<Inquiry> {
        const inquiryDto = CreateInquiryDto.createFromRequest(body);

        if (!inquiryDto.terms) {
            throw new HttpException({
                message: 'ValidationError',
                key: 'VALIDATION_ERROR',
                validationErrors: [
                    {
                        property: 'terms',
                    }
                ]
            }, HttpStatus.BAD_REQUEST);
        }

        if (!inquiryDto.privacy) {
            throw new HttpException({
                message: 'ValidationError',
                key: 'VALIDATION_ERROR',
                validationErrors: [
                    {
                        property: 'privacy',
                    }
                ]
            }, HttpStatus.BAD_REQUEST);
        }
        return this.inquiryService.create(inquiryDto);
    }

    @Post(Routes.ATTEND)
    attend(
        @Param('id') id: string,
        @Req() req: IRequest
    ): Promise<Inquiry> {
        return this.inquiryService.attend(id, req.auth.userId);
    }

    @Post(Routes.UNATTEND)
    unattend(
        @Param('id') id: string,
        @Req() req: IRequest
    ): Promise<Inquiry> {
        return this.inquiryService.unattend(id);
    }

    @Post(Routes.SOLVE)
    solve(
        @Param('id') id: string,
        @Req() req: IRequest
    ): Promise<Inquiry> {
        return this.inquiryService.solve(id, req.auth.userId.toHexString());
    }

    @Get(Routes.GET)
    get(
        @Query() query: IInquiryListParamsRequest
    ): Promise<Inquiry[]> {
        const inquiryListParams = InquiryListParams.createFromRequest(query);
        return this.inquiryService.get(inquiryListParams);
    }
}