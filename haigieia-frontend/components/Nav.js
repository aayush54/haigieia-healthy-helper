import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authUserContext";
import {
    Navbar,
    Center,
    Tooltip,
    UnstyledButton,
    createStyles,
    Stack,
} from "@mantine/core";
import {
    TablerIcon,
    IconHome2,
    IconGauge,
    IconDeviceDesktopAnalytics,
    IconFingerprint,
    IconCalendarStats,
    IconUser,
    IconSettings,
    IconLogout,
    IconSwitchHorizontal,
} from "@tabler/icons";
import { NextLink } from "@mantine/next";

const useStyles = createStyles((theme) => ({
    link: {
        width: 50,
        height: 50,
        borderRadius: theme.radius.md,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[5]
                    : theme.colors.gray[0],
        },
    },

    active: {
        "&, &:hover": {
            backgroundColor: theme.fn.variant({
                variant: "light",
                color: theme.primaryColor,
            }).background,
            color: theme.fn.variant({
                variant: "light",
                color: theme.primaryColor,
            }).color,
        },
    },
}));

function NavbarLink({ icon, label, active, onClick, href }) {
    const { classes, cx } = useStyles();
    
    console.log(onClick)

    return (
        <Tooltip label={label} position="right" transitionDuration={0}>
                <UnstyledButton
                    component={NextLink}
                    href={href}
                    onClick={onClick}
                    className={cx(classes.link, { [classes.active]: active })}
                >
                    <Icon icon={icon} />
                </UnstyledButton>
        </Tooltip>
    );
}

const data = [
    { icon: IconHome2, label: "Home", href: "/" },
    { icon: IconGauge, label: "Dashboard", href: "/dashboard" },
    { icon: IconUser, label: "Account", href: "/account" },
    { icon: IconSettings, label: "Settings", href: "/settings" },
];

const Icon = (props) => {
    const { icon } = props;
    const TheIcon = icon;
    return <TheIcon stroke={1.5} />;
};

export function NavbarMinimal(props) {
    const [active, setActive] = useState(2);
    const [signout, setSignout] = useState(null);
    const { signOutUser, loading } = useAuth();

    useEffect(() => {
        console.log('signout', signout)
        if(!loading) {
            setSignout(signOutUser)
        }
    }, [loading])

    const links = data.map((link, index) => (
        <NavbarLink
            {...link}
            href={link.href}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ));

    return (
        <Navbar width={{ xs: 80, lg: 80 }} p="md" {...props}>
            <Navbar.Section grow mt={10}>
                <Stack justify="center" spacing={0}>
                    {links}
                </Stack>
            </Navbar.Section>
            <Navbar.Section>
                <Stack justify="center" spacing={0}>
                    <NavbarLink icon={IconLogout} label="Logout" href="/" onClick={signout} />
                </Stack>
            </Navbar.Section>
        </Navbar>
    );
}
