/**
 * Domain configurations
 */
export interface Domain {
  name: string;
  secure: boolean;
  port?: number;
}

/**
 * Domains in our app
 */
export interface Domains {
  api: Domain;
  nodejs: Domain;
  global: Domain;
}

/**
 * Environment interface
 */
export interface IEnvironment {
  production: boolean;
  hmr: boolean;
  domains: Domains;
  maintenance: boolean;
}
