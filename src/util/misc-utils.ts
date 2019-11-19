import { Client } from "eris";
import { duration } from "moment";

export function getUptime(client: Client) {
    const uptime = duration(client.uptime)
    const d = Math.floor(uptime.asDays())
    const h = Math.floor(uptime.asHours())
    const m = Math.floor(uptime.asMinutes())
    if (d > 0)
        return format(uptime.days() + " days", uptime.hours() + " hours", uptime.minutes() + " minutes", uptime.seconds() + " seconds")
    else if (h > 0)
        return format(uptime.hours() + " hours", uptime.minutes() + " minutes", uptime.seconds() + " seconds")
    else if (m > 0)
        return format(uptime.minutes() + " minutes", uptime.seconds() + " seconds")
    else return format(uptime.seconds() + " seconds")       

    function format(...content: string[]) {
        return "Uptime: " + content.join(", ") + "."
    }
}