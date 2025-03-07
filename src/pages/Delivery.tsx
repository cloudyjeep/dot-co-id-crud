import { ClockAlert } from "lucide-react";
import { Section } from "../components/Custom";
import { Typography } from "@mui/material";
import { useDataProvince } from "../api/delivery";

const Delivery = () => {
  const { data } = useDataProvince();
  //   data?.results?.map
  console.log("Deliv: ", data?.results);
  
  return (
    <Section title="Delivery">
      <Typography display="flex" gap={2} py={1} color="error" fontWeight={600}>
        <ClockAlert></ClockAlert>
        {"API has cors issue"}
      </Typography>
    </Section>
  );
};

export default Delivery;
