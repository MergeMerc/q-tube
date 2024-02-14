import { Button, ButtonProps } from "@mui/material";
import { MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";
import {
  resetSubscriptions,
  subscribe,
  unSubscribe,
} from "../../state/features/persistSlice.ts";
import { setFilteredSubscriptions } from "../../state/features/videoSlice.ts";

interface SubscribeButtonProps extends ButtonProps {
  subscriberName: string;
}

export const SubscribeButton = ({
  subscriberName,
  ...props
}: SubscribeButtonProps) => {
  const dispatch = useDispatch();
  const filteredSubscriptionList = useSelector((state: RootState) => {
    return state.video.filteredSubscriptionList;
  });
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    const isSubscribedToName =
      filteredSubscriptionList.find(item => {
        return item.subscriberName === subscriberName;
      }) !== undefined;

    setIsSubscribed(isSubscribedToName);
  }, []);

  const subscriptionData = {
    userName: userName,
    subscriberName: subscriberName,
  };
  const subscribeToRedux = () => {
    dispatch(subscribe(subscriptionData));
    dispatch(
      setFilteredSubscriptions([...filteredSubscriptionList, subscriptionData])
    );
    setIsSubscribed(true);
  };
  const unSubscribeFromRedux = () => {
    dispatch(unSubscribe(subscriptionData));
    dispatch(
      setFilteredSubscriptions(
        filteredSubscriptionList.filter(
          item => item.subscriberName !== subscriptionData.subscriberName
        )
      )
    );
    setIsSubscribed(false);
  };

  const manageSubscription = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    isSubscribed ? unSubscribeFromRedux() : subscribeToRedux();
  };

  const verticalPadding = "3px";
  const horizontalPadding = "8px";
  const buttonStyle = {
    fontSize: "15px",
    fontWeight: "700",
    paddingTop: verticalPadding,
    paddingBottom: verticalPadding,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    borderRadius: 28,
    height: "45px",
    ...props.sx,
  };
  return (
    <Button
      {...props}
      variant={"contained"}
      color="error"
      sx={buttonStyle}
      onClick={e => manageSubscription(e)}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};
