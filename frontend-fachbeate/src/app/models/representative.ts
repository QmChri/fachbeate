import { Technologist } from "./technologist";

export interface Representative {

    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    active?: boolean;
    groupMembersRepresentatives?: Representative[];
    groupMembersTechnologist?: Technologist[];
}
