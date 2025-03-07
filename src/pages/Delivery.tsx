import { Box, ClockAlert } from "lucide-react";
import { Section } from "../components/Custom";
import { Typography } from "@mui/material";

const Delivery = () => {
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
