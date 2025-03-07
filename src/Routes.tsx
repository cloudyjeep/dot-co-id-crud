import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { actions, KeyStore, User, useStoreLoggedIn } from "./lib/store";
import { checkSession } from "./api/user";
import { parseJSON } from "./lib/utils";
import { useDispatch } from "react-redux";
import { decrypt } from "./lib/crypto";
import { Loader, loader } from "./components/Loader";
import { BoxFlex } from "./components/Custom";
import { CircularProgress } from "@mui/material";

// Path of routes
export enum Paths {
  EmployeeData = "/",
  EmployeeAdd = "/employee/add",
  EmployeeEdit = "/employee/edit/:id",
  Delivery = "/delivery",
}

// List of routes
const ListRoute = () => (
  <Routes>
    <Route path="*" element={loader(() => import("./pages/Employee/Data"))} />
    <Route
      path={Paths.EmployeeAdd}
      element={loader(() => import("./pages/Employee/Add"))}
    />
    <Route
      path={Paths.EmployeeEdit}
      element={loader(() => import("./pages/Employee/Edit"))}
    />
    <Route
      path={Paths.Delivery}
      element={loader(() => import("./pages/Delivery"))}
    />
  </Routes>
);

export default function () {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const loggedIn = useStoreLoggedIn();

  // validation session from cache localStorage
  useEffect(() => {
    let destroy: boolean;

    setTimeout(async () => {
      if (loggedIn || destroy) return;

      const session = localStorage.getItem(KeyStore);
      const data = parseJSON<User>(decrypt(session as string));
      if (data) {
        try {
          console.log("load daa");
          const user = await checkSession(data.email, data.password);
          dispatch(actions.setSession(user));
        } catch (e) {}
      }
      setLoading(false);
    });

    return () => {
      destroy = true;
    };
  }, []);

  if (loading)
    return (
      <BoxFlex height="100vh" alignItems="center" sx={{ opacity: 0.5 }}>
        <CircularProgress size={12} color="inherit" />
      </BoxFlex>
    );

  return loggedIn ? (
    <BrowserRouter>
      <Loader component={() => import("./components/Layout/MainLayout")}>
        <ListRoute />
      </Loader>
    </BrowserRouter>
  ) : (
    <Loader component={() => import("./pages/Login")} />
  );
}
