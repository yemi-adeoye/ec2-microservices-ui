import { Observable } from "rxjs";
import { AuthDetails } from "../models/AuthDetails";

export interface IAuthService {

  refreshLogin(): void

  logout(): void
}
