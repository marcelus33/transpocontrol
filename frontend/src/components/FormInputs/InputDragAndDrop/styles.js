import pxToRem from "assets/theme/functions/pxToRem";

export const Container = {
  alignItems: 'center',
  background: '#F1F7FE',
  border: '2px dashed #DBDBDB',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  gap: pxToRem(10),
  height: pxToRem(103),
  justifyContent: 'center',
  position: 'relative',
  width: 'inherit',
}

export const InputLabel = {
  background: '#fff',
  fontSize: pxToRem(12),
  fontWeight: 400,
  left: '10px',
  position: 'absolute',
  px: pxToRem(4),
  top: '-10px',
}

export const Text = ({palette: {info}}) => ({
  color: info.modal,
  fontWeight: 400,
})
