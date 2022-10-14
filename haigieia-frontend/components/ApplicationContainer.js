import {
    AppShell, Navbar,
} from "@mantine/core"
import FooterComponent from "./Footer"
import HeaderComponent from "./Header"
import { useState, useEffect } from 'react';
import { NavbarMinimal } from "./Nav";
import { useAuth } from "../context/authUserContext";

export const ApplicationContainer = ({children}) => {

    const [opened, setOpened] = useState(false);
    const { authUser, loading } = useAuth();
    const [navbarViz, setNavbar] = useState(false);

    useEffect(() => {
      if (!loading && authUser) {
        setNavbar(true)
      }
    
    }, [loading, authUser])
    

    return (
        <AppShell
        styles={{
            main: {
                background: "#f0f0f0",
                width: "100vw",
            }
        }}
        fixed
        navbarOffsetBreakpoint="xs"
        header={<HeaderComponent opened={opened} setOpened={setOpened} />}
        footer={<FooterComponent/>}
        navbar={  <NavbarMinimal hidden={!opened} p="md" hiddenBreakpoint="xs"  /> }
       
        >
            {children}
        </AppShell>
    )
}

