import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Domain, Domains } from '../environments/types';

interface DomainInfo {
  url: string;
  secure: boolean;
  domain: string;
}

/**
 * Service that converts environment domain settings to easy to use domain info objects
 */
@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private _info: { [key in keyof Domains]?: DomainInfo } = {};

  constructor() {
  }

  /**
   * Get a specific domain object
   * @param domain
   */
  public domainInfo(domain: keyof Domains): DomainInfo {
    if (!this._info[domain]) {
      this._info[domain] = this.getInfo(environment.domains[domain]);
    }
    return this._info[domain];
  }

  /**
   * Generates a domain info object based on the environment configuration
   * @param {Domain} domain
   * @return {DomainInfo}
   */
  private getInfo(domain: Domain): DomainInfo {
    let url = domain.secure ? 'https://' : 'http://';
    url += domain.name;
    if (domain.port) {
      url += ':' + domain.port;
    }
    return {
      url: url,
      domain: domain.name,
      secure: domain.secure
    };
  }
}
