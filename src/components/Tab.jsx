import { Button } from "@/components/ui/button";

const Tab = (props) => {
  return (
    <Button
      key={props.tab.value}
      variant={props.selectedTab === props.tab.value ? "default" : "outline"}
      onClick={(e) => props.onClick(props.tab.value)}
    >
      {props.tab.label}
    </Button>
  );
};

export default Tab;
