import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { HttpResponse } from '../shared/classes/http-response';
import { Filtering, Filtrate } from '../shared/decorators/filtrate.decorator';
import { Ordenate, Ordering } from '../shared/decorators/ordenate.decorator';
import { Paginate, Pagination } from '../shared/decorators/paginate.decorator';
import { PublicRoute } from '../shared/decorators/public-route.decorator';
import { Response } from '../shared/interceptors/data-transform.interceptor';
import { ResponsePaginate } from '../shared/interfaces/response-paginate.interface';
import { IdValidator } from '../shared/validators/id.validator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { PullUsuariosQueryParamsDto } from './dto/pull-usuarios-query-params.dto';
import { PullUsuariosResponseDto, UsuarioDto } from './dto/pull-usuarios-reponse.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { IUsuarioFilter } from './interfaces/usuario-filter.interface';
import { UsuarioService } from './usuario.service';

@Controller()
export class UsuarioController {
  constructor(private readonly _service: UsuarioService) { }

  @Post()
  @PublicRoute()
  async create(@Body() body: CreateUsuarioDto): Promise<Response<Usuario>> {
    const created = await this._service.create(body);
    created.senha = '';
    return new HttpResponse<Usuario>(created).onCreated();
  }

  @Get()
  async findAll(
    @Filtrate() queryParam: Filtering<IUsuarioFilter>,
    @Paginate() pagination: Pagination,
    @Ordenate() ordering: Ordering,
  ): Promise<ResponsePaginate<Usuario>> {
    return this._service.findAll(queryParam.filter, ordering, pagination);
  }

  @Get(':id')
  async findOne(@Param() param: IdValidator): Promise<Usuario> {
    return this._service.findOne(param.id, true);
  }

  @Patch(':id')
  async update(
    @Param() param: IdValidator,
    @Body() body: UpdateUsuarioDto,
  ): Promise<Response<Usuario>> {
    const updated = await this._service.update(param.id, body);
    return new HttpResponse<Usuario>(updated).onUpdated();
  }

  @Delete(':id')
  async remove(@Param() param: IdValidator): Promise<Response<unknown>> {
    const deleted = await this._service.remove(param.id);
    return new HttpResponse(deleted).onDeleted();
  }

  @MessagePattern({ role: 'info', cmd: 'get' })
  async findOneTCP(data: { id: number }): Promise<Usuario> {
    return this._service.findOne(data.id, true);
  }

  @MessagePattern({ role: 'info', cmd: 'getAll' })
  async findAllTCP(data: { ids: number[] }): Promise<Usuario[]> {
    return this._service.findAllToPublicacao(data.ids);
  }

  @Get('/sync/pull_users')
  async pullUsers(@Query() queryParam: PullUsuariosQueryParamsDto): Promise<Response<PullUsuariosResponseDto>> {
    const currentTime = Date.now();
    const targetTimestamp = new Date(Number(queryParam.lastPulledAt));
    const createdUsuarios = await this._service.allCreatedUsuariosSince(targetTimestamp);
    const updatedUsuarios = await this._service.allUpdatedUsuariosSince(targetTimestamp);

    return new HttpResponse({
      changes: {
        usuario: {
          created: plainToInstance(UsuarioDto, createdUsuarios),
          updated: plainToInstance(UsuarioDto, updatedUsuarios),
          deleted: []
        }
      },
      timestamp: currentTime
    }).onSuccess('success');
  }
}
