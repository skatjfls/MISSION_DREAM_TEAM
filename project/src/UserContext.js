import React, {useState} from "react";

export const UserContext = React.createContext();

export const UserProvider = ({children}) => {
    const [userId, setUserId] = useState(null);

    return (
        <UserContext.Provider value={{userId, setUserId}}>
            {children}
        </UserContext.Provider>
    );
};