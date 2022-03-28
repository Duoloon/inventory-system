import { Add } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { Box, Typography, Button, Divider, styled, Modal } from '@mui/material'
import { useLocation, useLicense } from '../../Hooks'
import { titles } from '../../variables'
import { read, utils } from 'xlsx'
import { useSnackbar } from 'notistack'

const Input = styled('input')({
  display: 'none'
})
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}
export const AppBar = ({ action, saveData, allProduct }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { path, setPath } = useLocation()
  const [excel, setExcel] = useState(null)
  const [open, setOpen] = useState(false)
  const { status } = useLicense()
  const handleClose = () => setOpen(false)
  const handleChange = async e => {
    const file = e.target.files[0]
    const data = await file.arrayBuffer()
    /* data is an ArrayBuffer */
    setExcel(data)
  }

  useEffect(() => {
    if (excel) {
      try {
        const workbook = read(excel)
        const workbookSheets = workbook.SheetNames
        const sheet = workbookSheets[0]
        const dataExcel = utils.sheet_to_json(workbook.Sheets[sheet])
        saveData({ data: dataExcel })
      } catch (error) {
        enqueueSnackbar('Error Insertando los datos del excel', {
          variant: 'error'
        })
      }
      setExcel(null)
    }
  }, [excel])
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          padding: 3
        }}
      >
        <Typography
          variant="h5"
          color="primary"
          fontWeight={'bold'}
          gutterBottom
          component="div"
        >
          {titles[path]}
        </Typography>
        {path === '/' ? (
          <>
            <Button
              sx={{ marginLeft: 'auto' }}
              color="primary"
              onClick={() => {
                setPath(path + 'inventory/entry')
              }}
              variant="contained"
            >
              Entrada al inventario
            </Button>
            <Button
              sx={{ marginLeft: 3 }}
              color="primary"
              onClick={() => {
                setPath(path + 'inventory/history/entry')
              }}
              variant="outlined"
            >
              Historial de Entrada
            </Button>
            <Button
              sx={{ marginLeft: 3 }}
              color="primary"
              onClick={() => {
                setPath(path + 'inventory/exit')
              }}
              variant="contained"
            >
              Salida del inventario
            </Button>
            <Button
              sx={{ marginLeft: 3 }}
              color="primary"
              onClick={() => {
                setPath(path + 'inventory/history/exit')
              }}
              variant="outlined"
            >
              Historial de salida
            </Button>
          </>
        ) : path === '/inventory/history/entry' ||
          path === '/inventory/history/exit' ||
          path === '/setting' ? null : (
          <>
            <label
              htmlFor="contained-button-file"
              style={{ marginLeft: 'auto' }}
            >
              <Input
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                id="contained-button-file"
                multiple
                type="file"
                disabled={
                  (status() && path === '/product') ||
                  (path === '/product' && allProduct.length === 50)
                    ? true
                    : false
                }
                onChange={handleChange}
              />
              <Button
                variant="outlined"
                disabled={
                  (status() && path === '/product') ||
                  (path === '/product' && allProduct.length === 50)
                    ? true
                    : false
                }
                component="span"
              >
                Importar Excel
              </Button>
            </label>
            <Button
              sx={{ marginLeft: 3 }}
              onClick={() => {
                if (
                  (status() && path === '/product') ||
                  (path === '/product' && allProduct.length === 50)
                ) {
                  setOpen(true)
                } else {
                  setPath(path + '/create')
                  action(true)
                }
              }}
              variant="contained"
            >
              <Add />
              Agregar
            </Button>
          </>
        )}
      </Box>
      <Divider />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </>
  )
}
