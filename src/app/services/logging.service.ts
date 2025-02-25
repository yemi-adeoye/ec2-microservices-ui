import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';
import { UserService } from './user.service';
import { ACCESS_TOKEN } from '../constants/constants';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly cacheService: CacheService,
    private readonly userService: UserService,
  ) { }

  getUserLogs() {
    const token: string = this.cacheService.getItem(ACCESS_TOKEN)
    const username = this.userService.getUsername(token)

    return this.httpClient.get(`${environment.apiGatewayUrl}/logs/${username}`);
  }

}
