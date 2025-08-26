export const hotelManagement = "Hotel_Management";

export const UserRoles = {
    ADMIN: "admin",
    USER: "user"
};

export const AvailableUserRoles = Object.values(UserRoles);

export const RoomTypes = {
    STANDARD: "standard",
    DELUXE: "deluxe",
    LUXURY: "luxury"
}

export const AvailableRoomTypes = Object.values(RoomTypes);

export const RoomStatus = {
    AVAILABLE: "available",
    MAINTENANCE: "maintenance",
    OCCUPIED: "occupied"
}

export const AvailableRoomStatus = Object.values(RoomStatus);

export const BookingStatus = {
    CONFIRMED: "confirmed",
    PENDING: "pending",
    CANCELLED: "cancelled",
    COMPLETED: "completed"
}

export const AvailableBookingStatus = Object.values(BookingStatus);