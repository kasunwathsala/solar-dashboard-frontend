import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { switchAnomaliesTab } from "@/lib/features/uiSlice";
import { useDispatch } from "react-redux";

const EnergyTab = (props) => {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.ui.selectedAnomaliesTab || '7days');

  return (
    <Button
      key={props.tab.value}
      variant={selectedTab === props.tab.value ? "default" : "outline"}
      onClick={(e) => dispatch(switchAnomaliesTab(props.tab.value))}
    >
      {props.tab.label}
    </Button>
  );
};

export default EnergyTab;
