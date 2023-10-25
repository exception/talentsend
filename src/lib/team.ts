import { Organization } from "@prisma/client";

export const isTeamPremium = (team: Organization) => {
    return team.plan != "FREE";
}