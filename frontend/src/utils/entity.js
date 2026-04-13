export const hasId = (value) => value !== null && value !== undefined && value !== "";

export const getEntityId = (entity) => {
  if (!entity || typeof entity !== "object") {
    return null;
  }

  if (hasId(entity.id)) {
    return entity.id;
  }

  if (hasId(entity._id)) {
    return entity._id;
  }

  return null;
};

export const getShowId = (show) => {
  if (!show || typeof show !== "object") {
    return null;
  }

  if (hasId(show.showId)) {
    return show.showId;
  }

  return getEntityId(show);
};

export const getTicketId = (ticket) => {
  if (!ticket || typeof ticket !== "object") {
    return null;
  }

  if (hasId(ticket.ticketId)) {
    return ticket.ticketId;
  }

  return getEntityId(ticket);
};

export const toNumberId = (value) => {
  if (!hasId(value)) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
};

export const idsMatch = (left, right) => {
  if (!hasId(left) || !hasId(right)) {
    return false;
  }

  return String(left) === String(right);
};
