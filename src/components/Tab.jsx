import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { switchHomeTab } from "@/lib/features/uiSlice";
import { useDispatch } from "react-redux";

const Tab = (props) => {
    const selectedTab = useSelector((state) => state.ui.selectedHomeTab);
    const dispatch = useDispatch();

  return (
    <Button
      key={props.tab.value}
      // variant={props.selectedTab === props.tab.value ? "default" : "outline"}
      variant={selectedTab === props.tab.value ? "default" : "outline"}
      // onClick={(e) => props.onClick(props.tab.value)}
      onClick={(e) => dispatch(switchHomeTab(props.tab.value))}
    >
      {props.tab.label}
    </Button>
  );
};

export default Tab;
