import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(customParseFormat);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Dhaka");

export default dayjs;