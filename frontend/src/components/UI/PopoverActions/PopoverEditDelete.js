import { PopoverActions, PopoverItem } from "./index";

export const PopoverDeleteText = ({ palette: { popover } }) => ({
  color: popover.delete_text,
  cursor: "pointer",
});

export const PopoverEditDelete = ({ open, onClose, anchorEl, onClickEdit, onClickDelete }) => {
  return (
    <PopoverActions open={open} onClose={onClose} anchorEl={anchorEl}>
      {onClickEdit && <PopoverItem label={"Edit"} onClick={onClickEdit} />}
      {onClickDelete && (
        <PopoverItem label={"Delete"} onClick={onClickDelete} sx={PopoverDeleteText} />
      )}
    </PopoverActions>
  );
};
