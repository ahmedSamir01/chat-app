export const handleKeyPress = (
  event: { key: string },
  callback: (e?: unknown) => void
) => {
  // Check if the pressed key is Enter (key code 13)
  event.key === "Enter" && callback();
};
