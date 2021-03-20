import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatorModel } from '@gpx/models/paginator.model';
import { DomainService } from '../domain.service';
import { CookieService } from '../cookie.service';
import { BaseModel } from '@gpx/models/base';
import { map } from 'rxjs/operators';

export type QueryParams_t<T extends QueryParams> = { [key in keyof T]?: T[key] };

export class QueryParams {
  // Almost all list endpoints have search and ordering filter
  search: string;
  order: string;

  // For pagination
  page: number;
  page_size: number;

  public assign(...args: (QueryParams_t<this> | this)[]): this {
    Object.assign(this, ...args);
    return this;
  }

  /**
   * return non-empty values from filter
   */
  getParams(includeEmpty = false): { [key: string]: any } {
    const query = {};
    for (const key of Object.keys(this)) {
      const value = this[key];
      if (includeEmpty || value !== undefined && value !== null && value !== '') {
        query[key] = this[key];
      }
    }
    return query;
  }
}

@Injectable()
export abstract class RootService {
  private static root: string;

  constructor(
    protected http: HttpClient,
    private domainService: DomainService,
    protected cookieService: CookieService) {
    if (!RootService.root) {
      RootService.root = domainService.domainInfo('api').url;
    }
  }

  protected abstract getActionUrl(): string;

  /**
   * builds api url: api root + action url. Adds given arguments (as url parameters) to the uri.
   * url params as {{key}}
   * optional url params as {{key?}}
   * optional url sections as {%section/{{key}}%}, only added when all required keys present
   * optional url section without keys will always be added (beep/{%section/%} will be beep/section/)
   * @param urlParams: object with url parameters
   */
  protected buildUrl(urlParams: object = {}): string {
    let uri: string = this.getActionUrl();
    let match = /{%([^%]+)%}/g.exec(uri);
    while (match) {
      const fullOptionalUriMatch = match[0];
      let uriPart = match[1];
      let subMatch = /{{([^?\/]+)(\??)}}/g.exec(uriPart);
      while (subMatch) {
        const fullMatch = subMatch[0], key = subMatch[1], optional = subMatch[2];
        if (!optional && !(key in urlParams)) {
          uriPart = '';
          break;
        }
        uriPart = uriPart.replace(fullMatch, urlParams[key] || '');
        subMatch = /{{([^?\/]+)(\??)}}/g.exec(uriPart);
      }
      uri = uri.replace(fullOptionalUriMatch, uriPart);
      match = /{%([^%]+)%}/g.exec(uri);
    }
    match = /{{([^?\/]+)(\??)}}/g.exec(uri);
    while (match) {
      const fullMatch = match[0], key = match[1], optional = match[2];
      if (!optional && !(key in urlParams)) {
        throw new Error('missing required url param: ' + key);
      }
      uri = uri.replace(fullMatch, urlParams[key] ? urlParams[key] : '');
      match = /{{([^?\/]+)(\??)}}/g.exec(uri);
    }
    uri = uri.replace('//', '/');
    if (!uri.endsWith('/')) {
      uri += '/';
    }
    return RootService.root + uri;
  }
}

/**
 * Service to extend from for full CRUD from database
 */
@Injectable()
export abstract class DataService<TList extends TObject[] | PaginatorModel<TObject>, TObject extends BaseModel> extends RootService {
  protected abstract get model(): new() => TObject;

  /**
   * @param url: url to get a list
   */
  public getListByUrl(url: string): Observable<TList> {
    return this.deserializeResponseList(
      this.http.get<TList>(
        url
      )
    );
  }

  /**
   * @param urlParams: (optional) parameters in action url
   * @param query: (optional) query params dict for filtering
   */
  protected getList(urlParams?: object, query?: QueryParams): Observable<TList> {
    return this.deserializeResponseList(
      this.http.get<TList>(
        this.buildUrl(urlParams),
        {params: query ? query.getParams() : null}
      )
    );
  }

  /**
   * Retrieve single object.
   * @param urlParams: (optional) parameters in action url
   * @param query: (optional) query params dict for filtering
   */
  protected get(urlParams?: object, query?: QueryParams): Observable<TObject> {
    return this.deserializeResponseObject(
      this.http.get<TObject>(
        this.buildUrl(urlParams),
        {params: query ? query.getParams() : null}
      )
    );
  }

  /**
   * Add object.
   * @param itemToAdd: instance of the item to add
   * @param urlParams: (optional) parameters in action url
   */
  protected add(itemToAdd: TObject, urlParams?: object): Observable<TObject> {
    return this.deserializeResponseObject(
      this.http.post<TObject>(
        this.buildUrl(urlParams),
        JSON.stringify(itemToAdd)
      )
    );
  }

  /**
   * Update object.
   * @param itemToUpdate: instance of the item to update
   * @param urlParams: (optional) parameters in action url
   */
  protected update(itemToUpdate: TObject, urlParams?: object): Observable<TObject> {
    return this.deserializeResponseObject(
      this.http.patch<TObject>(
        this.buildUrl(urlParams),
        JSON.stringify(itemToUpdate)
      )
    );
  }


  /**
   * Bulk Update object.
   * @param itemToUpdate: instance of the item to update
   * @param urlParams: (optional) parameters in action url
   * @param query: (optional) query params dict for filtering
   */
  protected bulkUpdate(itemToUpdate: TObject, urlParams?: object, query?: QueryParams): Observable<TObject> {
    return this.deserializeResponseObject(
      this.http.patch<TObject>(
        this.buildUrl(urlParams),
        JSON.stringify(itemToUpdate),
        {params: query ? query.getParams() : null},
      )
    );
  }

  /**
   * Remove object.
   * @param urlParams: (optional) parameters in action url
   */
  protected remove(urlParams?: object): Observable<null> {
    return this.http.delete<null>(
      this.buildUrl(urlParams)
    );
  }

  /**
   * Remove object.
   * @param urlParams: (optional) parameters in action url
   * @param query: (optional) query params dict for filtering
   */
  protected bulkRemove(urlParams?: object, query?: QueryParams): Observable<null> {
    return this.http.delete<null>(
      this.buildUrl(urlParams), {params: query ? query.getParams() : null},
    );
  }

  private deserializeResponseList(responseList: Observable<TList>): Observable<TList> {
    const self = this;
    return responseList.pipe(map(list => {
      if ('pages' in list && 'links' in list && 'results' in list) {  // marks as paginated response
        list['results'] = list['results'].map(obj => this.deserializeObject(obj));
        return list;
      } else if (list instanceof Array) {
        list.forEach((obj, index) => list[index] = self.deserializeObject(obj));
        return list;
      }
      return list;
    }));
  }

  private deserializeResponseObject(responseObj: Observable<TObject>): Observable<TObject> {
    return responseObj.pipe(map(obj => this.deserializeObject(obj)));
  }

  private deserializeObject(obj: TObject): TObject {
    return new this.model().deserialize(obj);
  }
}

