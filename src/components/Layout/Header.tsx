import { actions, useStoreUser } from "../../lib/store";
import { BoxFlex } from "../Custom";
import { Button, colors, IconButton, Typography } from "@mui/material";
import { LogOut } from "lucide-react";
import { useDialog } from "../Dialog";
import { useDispatch } from "react-redux";
import { NavLink, useMatch } from "react-router-dom";
import { Paths } from "../../Routes";
import { useIsMobile } from "../../lib/hook";

export const Header = () => {
  const dispatch = useDispatch();
  const user = useStoreUser();

  const dialog = useDialog({
    onConfirm() {
      dispatch(actions.clearSession());
    },
  });

  const mobile = useIsMobile();

  const navigation = (
    <BoxFlex gap={1} alignItems="center">
      <Nav
        to={Paths.EmployeeData}
        match={[Paths.EmployeeAdd, Paths.EmployeeEdit]}
        children={"Employee"}
      />
      <Nav to={Paths.Delivery} match={[Paths.Delivery]} children={"Delivery"} />
    </BoxFlex>
  );

  const component = (
    <BoxFlex
      alignItems="center"
      py={1.5}
      borderBottom={`1px solid ${colors.grey[200]}`}
    >
      <dialog.content>{"Logout ?"}</dialog.content>

      <BoxFlex height={36} minWidth={80}>
        <img src="/icon.svg" alt="logo" />
      </BoxFlex>

      {!mobile && navigation}

      <BoxFlex flex={1} gap={1.75} justifyContent="flex-end">
        <BoxFlex column pt={0.25}>
          <Typography variant="h3" fontSize={16}>
            {user.name}
          </Typography>
          <Typography variant="caption">{user.email}</Typography>
        </BoxFlex>

        <IconButton
          color="primary"
          onClick={dialog.open}
          sx={{ border: 1.5, borderColor: "primary.main" }}
        >
          <LogOut />
        </IconButton>
      </BoxFlex>
    </BoxFlex>
  );

  if (!mobile) return component;

  return (
    <BoxFlex column gap={1.5}>
      {component}
      {navigation}
    </BoxFlex>
  );
};

const Nav: FC<{
  to: string;
  match: string[];
  idx: number;
  active: boolean;
}> = ({ to, match = [], children, idx = 0, active }) => {
  if (!match?.length && !to) return null;

  if (idx === match?.length || active) {
    const on = Boolean(useMatch(to as string));

    return (
      <NavLink to={to as string}>
        <Button
          size="small"
          variant={active || on ? "contained" : "text"}
          disableElevation
          sx={{ minWidth: 100 }}
          children={children}
        />
      </NavLink>
    );
  }

  const isActive = Boolean(useMatch(match[idx]));

  return (
    <Nav to={to} match={match} idx={idx + 1} active={isActive}>
      {children}
    </Nav>
  );
};
