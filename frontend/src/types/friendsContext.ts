export interface SearchUser {
	id: number;
	name: string;
	alias: string;
}

export interface FriendsContextType {
	friends: Friend[];
	pending: Friend[];
	loading: boolean;
	refreshFriends: () => Promise<void>;
	sendRequest: (toUserId: number) => Promise<{ ok: boolean; message?: string }>;
	acceptRequest: (toUserId: number) => Promise<{ ok: boolean; message?: string }>;
	declineRequest: (toUserId: number) => Promise<{ ok: boolean; message?: string }>;
	removeFriend: (friendId: number) => Promise<{ ok: boolean; message?: string }>;
}

export interface Friend {
	id: number;
	alias: string;
	avatar?: string;
	from: number;
	to: number;
	status: FriendStatus;
}

export enum FriendStatus {
	Accepted = 1,
	Pending = 2,
}

export interface FriendsApiResponse {
	user_a: number;
	user_b: number;
	status: number;
}

export interface SearchProps {
	user: SearchUser;
  onSelect: (user: SearchUser) => void;
}