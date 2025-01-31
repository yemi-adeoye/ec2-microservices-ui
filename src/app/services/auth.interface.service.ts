import { Observable } from "rxjs";
import { AuthDetails } from "../models/AuthDetails";

export interface IAuthService {

  refreshLogin(): AuthDetails

  logout(): void
}
