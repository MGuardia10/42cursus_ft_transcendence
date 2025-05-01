export interface SearchUser {
	id: number;
	name: string;
	alias: string;
}

export interface FriendsContextType {
	friends: Friend[];
	pending: Friend[];
	loading: boolean;
	error: string | null;
	refreshFriends: () => Promise<void>;
	sendRequest: (toUserId: number) => Promise<boolean>;
	acceptRequest: (toUserId: number) => Promise<boolean>;
	declineRequest: (toUserId: number) => Promise<boolean>;
	removeFriend: (friendId: number) => Promise<boolean>;
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