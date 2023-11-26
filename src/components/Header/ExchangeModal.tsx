import { Grid, TextField, Stack /* Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CharacterChooseModal from './CharacterChooseModal'
import {
  checkCooldown,
  claimHunter,
  levelupHunter,
  startHunterUpgradeCooldown,
} from '../../store/user/actions'
import { useWeb3Context } from '../../hooks/web3Context'
import { global } from '../../common/global'
import "./modal.css"
import SelectEggModal from './selectEggModal'

interface Props {
  open: any
  setOpen: any
  Drg: any
  egg: any
  setDrg: any
  setEgg: any
}

const ExchangeModal = ({
  open,
  setOpen,
  Drg,
  egg,
  setDrg,
  setEgg,
}: Props) => {
  const { connected, chainID, address, connect } = useWeb3Context()

  const userModule = useSelector((state: any) => state.userModule)
  const [openCharacterChoose, setOpenChraracterChoose] = useState(false)
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(-1)
  const [selectedCharacterList, setSelectedCharacterList] = useState([-1, -1, -1])
  const [claimBar, setClaimBar] = useState([-1, -1, true])
  const [selectedCharacter, setSelectedCharacter] = useState(-1)

  const [upgradeLevel, setUpgradeLevel] = useState(global.hunterLevel)

  const [remainedTime, setRemainedTime] = React.useState(0)
  const [isCooldownStarted, setIsCooldownStarted] = useState(false)
  const dispatch = useDispatch<any>()
  const [btnType, setBtnType] = useState('Start')
  const [cooldownCount, setCooldownCount] = useState(0);
  const [eggModalOpen, setEggModalOpen] = useState(false);

  var convertSecToHMS = (number: number) => {
    const toTime = Math.floor(number % 30)
    const hours = Math.floor(toTime / 3600)
      .toString()
      .padStart(2, '0')
    const minutes = Math.floor((toTime % 3600) / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (toTime % 60).toString().padStart(2, '0')
    const formattedTime = `${minutes}:${seconds}` /*${hours}:*/
    return formattedTime
  }

  const onBtnClick = () => {
    if (remainedTime > 0)
      return
    if (btnType === 'Start') {
      if (cooldownCount === 0) {
        alert("Input Count of Eggs")
        return
      }
      if(egg < cooldownCount || egg <= 0) {
        alert("Not Enough Drg")
        return
      }
      dispatch(
        startHunterUpgradeCooldown(address, cooldownCount, (resp: any) => {
          console.log("user.repdata==>", resp.data);
          if (resp.data !== undefined || resp.data !== null) {
            setRemainedTime(30 * cooldownCount)
            setIsCooldownStarted(true)
            console.log("user.eggs==>", resp.data);
            setEgg(resp.data)
          }
        }),
      )
    } else if (btnType === 'Claim') {
      dispatch(
        claimHunter(address, (resp: any) => {
          setBtnType('Start')
          setDrg(resp.data.drg);
        }),
      )
    }
  }

  //  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false)
  useEffect(() => {
    if (selectedCharacterIndex >= 0) {
      let temp = selectedCharacterList
      temp[selectedCharacterIndex] = selectedCharacter

      setSelectedCharacterList([...temp])
    }
  }, [selectedCharacter])
  useEffect(() => {
    if (isCooldownStarted) {
      var cooldownInterval = setInterval(() => {
        setRemainedTime((prevTime) => {
          if (prevTime === 1) {

            setBtnType('Claim')
            dispatch(
              checkCooldown(address, 'hunter-level-up', (res: any) => {
                let cooldownSec = res.data.time;
                console.log(res.data.count)
                if(Number.isNaN(res.data.count) || res.data.count === undefined) {
                  setCooldownCount(0)
                  return
                }
                setCooldownCount(res.data.count);
                if (cooldownSec === false) {
                  setRemainedTime(-1)
                  setIsCooldownStarted(false)

                  setBtnType('Start')
                } else if (cooldownSec <= 0) {
                  setRemainedTime(-1)
                  setIsCooldownStarted(false)

                  setBtnType('Claim')
                } else {
                  setRemainedTime(cooldownSec)
                  setIsCooldownStarted(true)
                }
              }),
            )
          }
          if (prevTime === 0) {


            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => clearInterval(cooldownInterval)
  }, [isCooldownStarted])
  useEffect(() => {
    if (open === true)
      dispatch(
        checkCooldown(address, 'hunter-level-up', (res: any) => {
          let cooldownSec = res.data.time
          console.log(res.data.count)
          if(Number.isNaN(res.data.count) || res.data.count === undefined) {
            setCooldownCount(0)
            return
          }
          setCooldownCount(res.data.count);
          if (cooldownSec === false) {
            setRemainedTime(-1)
            setIsCooldownStarted(false)

            setBtnType('Start')
          } else if (cooldownSec <= 0) {
            setBtnType('Claim')
            setRemainedTime(-1)
            setIsCooldownStarted(false)

          } else {
            setRemainedTime(cooldownSec)
            setIsCooldownStarted(true)
          }
        }),
      )
  }, [open, dispatch])

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 150,
      md: 700,
    },
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img alt="" src="/images/support/support_md_bg.png" />

          <img
            alt=""
            src="/images/support/support_md_close_btn.png"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '7%',
              transform: 'translate(26%, -27%)',
              cursor: 'pointer',
              zIndex: 5,
            }}
            onClick={handleClose}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <Box>
              <div
                style={{
                  fontFamily: 'CubicPixel',
                  fontWeight: 'bold',
                  fontSize: '40px',
                  textAlign: 'center',
                  marginTop: '8%',
                  color: '#e7e1e1',
                  lineHeight: '100%',
                }}
              >
                <p>MINE TOWN</p>
              </div>
            </Box>
            <Grid
              container
              spacing={3}
              sx={{
                padding: '8% 6% 20% 8%',
                width: '100%',
                height: '36%',
                margin: 0,
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'CubicPixel',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  color: '#e7e1e1',
                  width: "50%",
                  textAlign: "center"
                }}
              >
                <p>SELECT DRAGONS</p>
                <Grid
                  container
                  spacing={1}
                  sx={{
                    width: '100%',
                    height: '36%',
                    margin: 0,
                    justifyContent: 'center',
                  }}
                >
                  <div className='selectBtn' onClick={() => alert()}>+</div>
                  <div className='selectBtn' onClick={() => alert()}>+</div>
                  <div className='selectBtn' onClick={() => alert()}>+</div>
                </Grid>
              </div>
              <div
                style={{
                  fontFamily: 'CubicPixel',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  color: '#e7e1e1',
                  width: "50%",
                  textAlign: "center"
                }}
              >
                <p>
                  SELECT EGGS
                  <span
                    id="eggNum"
                    style={{
                      position: "absolute",
                      fontSize: "35px",
                      visibility: "visible",
                    }}
                  >
                    &nbsp;&nbsp;{cooldownCount}
                  </span>
                </p>
                <Grid
                  container
                  spacing={3}
                  sx={{
                    width: '100%',
                    height: '36%',
                    margin: 0,
                    justifyContent: 'center',
                  }}
                >
                  <div className='selectBtn' onClick={() => setEggModalOpen(true)}>+</div>
                </Grid>
              </div>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{
                width: '100%',
                margin: 0,
                alignItems: 'center',

              }}
            >
              <Button
                onClick={() => onBtnClick()}
                sx={{
                  width: '40%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: "70px",
                }}
              >
                <img alt="" src="/assets/images/big-button.png" />
                <p
                  style={{
                    position: 'absolute',
                    fontFamily: 'CubicPixel',
                    fontSize: '28px',
                    textAlign: 'center',
                    color: '#e7e1e1',
                    letterSpacing: "2px"
                  }}
                >
                  {remainedTime <= 0 ? btnType : convertSecToHMS(remainedTime)}
                </p>
              </Button>
              <div
                style={{
                  position: "absolute",
                  right: '170px',
                  bottom: '65px',
                  textAlign: "center"
                }}
              >
                <p style={{
                  fontFamily: 'CubicPixel',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  color: '#e7e1e1',
                }}>REWARD</p>
                <div
                  className='displayCenter'
                  style={{
                    width: '120px', height: '70px',
                    border: '2px solid #3b5c53',
                    borderRadius: '23px',
                    backgroundColor: '#e8ede9',
                    boxShadow: '2px 2px 5px #33a597',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'CubicPixel',
                      fontSize: '30px',
                      fontWeight: 'bold',
                      color: "#ff8a00",
                      textShadow: '1px 1px black'
                    }}
                  >
                    {10 * cooldownCount}
                  </span> &nbsp;
                  <span
                    style={{
                      fontFamily: 'CubicPixel',
                      fontSize: '30px',
                      fontWeight: 'bold',
                      color: "#f0f0f0",
                      textShadow: '1px 1px black'
                    }}
                  >
                    DRG
                  </span>
                </div>
              </div>
            </Grid>
          </Box>
        </Box>
      </Modal>
      <SelectEggModal 
      eggModalOpen={eggModalOpen} 
      setEggModalOpen={setEggModalOpen}
      cooldownCount={cooldownCount}
      setCooldownCount={setCooldownCount}
      />
      {/* <CharacterChooseModal
        open={openCharacterChoose}
        setOpen={setOpenChraracterChoose}
        selectedCharacterList={selectedCharacterList}
        selectedCharacterIndex={selectedCharacterIndex}
        setSelectedCharacter={setSelectedCharacter}
      /> */}
    </>
  )
}

export default ExchangeModal
