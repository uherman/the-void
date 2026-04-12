"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { ensureUser, updateDisplayName } from "@/actions/users";

interface UserState {
  userId: string | null;
  displayName: string;
  isLoaded: boolean;
  isNewUser: boolean;
}

interface UserContextValue extends UserState {
  setName: (name: string) => Promise<void>;
  dismissNewUser: () => void;
}

const UserContext = createContext<UserContextValue>({
  userId: null,
  displayName: "Anonymous",
  isLoaded: false,
  isNewUser: false,
  setName: async () => {},
  dismissNewUser: () => {},
});

const STORAGE_KEY = "thoughts_user_id";
const NAME_KEY = "thoughts_display_name";

const SERVER_STATE: UserState = {
  userId: null,
  displayName: "Anonymous",
  isLoaded: false,
  isNewUser: false,
};

// Module-level external store for user state
let userState: UserState = { ...SERVER_STATE };
let listeners: Array<() => void> = [];
let initialized = false;

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function setUserState(partial: Partial<UserState>) {
  userState = { ...userState, ...partial };
  emitChange();
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return userState;
}

function getServerSnapshot() {
  return SERVER_STATE;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (initialized) return;
    initialized = true;

    let id = localStorage.getItem(STORAGE_KEY);
    const isNew = !id;

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }

    const cachedName = localStorage.getItem(NAME_KEY);

    setUserState({
      userId: id,
      isNewUser: isNew,
      displayName: cachedName || "Anonymous",
    });

    ensureUser(id).then((user) => {
      if (user) {
        setUserState({
          displayName: user.display_name,
          isLoaded: true,
          isNewUser: isNew || user.display_name === "Anonymous",
        });
        localStorage.setItem(NAME_KEY, user.display_name);
      } else {
        setUserState({ isLoaded: true });
      }
    });
  }, []);

  const setName = useCallback(async (name: string) => {
    const uid = getSnapshot().userId;
    if (!uid) return;
    await updateDisplayName(uid, name);
    setUserState({ displayName: name, isNewUser: false });
    localStorage.setItem(NAME_KEY, name);
  }, []);

  const dismissNewUser = useCallback(() => {
    setUserState({ isNewUser: false });
  }, []);

  return (
    <UserContext.Provider
      value={{ ...state, setName, dismissNewUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
