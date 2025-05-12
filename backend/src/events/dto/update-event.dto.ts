import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

/**
 * UpdateEventDto наследует все поля CreateEventDto, но делает их необязательными.
 * Используется при PATCH /events/:id — можно обновить любую часть события.
 */
export class UpdateEventDto extends PartialType(CreateEventDto) {}
