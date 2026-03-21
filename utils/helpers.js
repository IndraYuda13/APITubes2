const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

function userToDict(u) {
  return { id: u.id, email: u.email, name: u.name, role: u.role, phone: u.phone, address: u.address, profile_photo: u.profile_photo };
}

function bookingToDict(b) {
  return {
    id: b.id,
    user_name: b.User?.name,
    type: b.type,
    item_id: b.item_id,
    item_name: b.item_name,
    start_time: dayjs(b.start_time).format("YYYY-MM-DD HH:mm"),
    end_time: dayjs(b.end_time).format("YYYY-MM-DD HH:mm"),
    status: b.status,
    quantity: b.quantity ?? 1,
    notes: b.notes,
  };
}

function parseDateTimeStrict(str) {
  const dt = dayjs(str, "YYYY-MM-DD HH:mm", true);
  return dt.isValid() ? dt.toDate() : null;
}

module.exports = { userToDict, bookingToDict, parseDateTimeStrict };