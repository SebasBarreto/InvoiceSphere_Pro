import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();
      this.logger.error(`HTTP Exception: ${JSON.stringify(message)}`);
      response.status(status).json(message);
    } else {
      this.logger.error(`Excepción no controlada: ${exception}`);
      response.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }
}
