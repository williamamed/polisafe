import { SecuritySession } from '../models/security.session';
import { SessionDto } from '../dto/session.dto';
export declare class SessionService {
    private sessionModel;
    listAll(username: string): Promise<SecuritySession[]>;
    listActive(username: string): Promise<SecuritySession[]>;
    create(sessionDto: SessionDto): Promise<SecuritySession>;
    update(sessionDto: SessionDto): Promise<[affectedCount: number]>;
    destroy(sessionDto: SessionDto): Promise<number>;
}
