import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Grid, Button, Typography, Stack } from '@mui/material'
import Modal from '@mui/material/Modal'
import { width } from '@mui/system'
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import ExchangeModal from '../../components/Header/ExchangeModal'
import Header from '../../components/Header/Header'
import DepositModal from '../../components/Modal/DepositModal'
import InstructionModal from '../../components/Modal/InstructionModal'
import MiningModal from '../../components/Modal/MiningModal'
import { STAKE_TIMER } from '../../hooks/constants'
import { useWeb3Context } from '../../hooks/web3Context'
import {
  claimBird,
  claimDiamond,
  stakeBird,
  stakeDiamond,
  swapEggs,
  swapResources,
  upgradeWall,
  checkCooldown,
  claimDrg,
  convertDrg,
  setCooldown
} from '../../store/user/actions'
import { showMinutes } from '../../utils/timer'

import styles from './Main.module.scss'
import UpgradeWallModal from '../../components/Header/UpgradeWallModal'
import { global } from '../../common/global'
import RockModal from '../../components/Header/RockModal'
import { NONE } from 'phaser'
import { transform } from 'typescript'

interface MainProps {
  showAccount: any
  setShowAccount: any
}

const Main = ({ showAccount, setShowAccount }: MainProps) => {
  const dispatch = useDispatch<any>()
  const userModule = useSelector((state: any) => state.userModule)
  const { user } = userModule

  const [openBird, setOpenBird] = React.useState(false)
  const [Drg, setDrg] = useState(userModule.user.Drg)
  const [eggs, setEggs] = useState(userModule.user.eggs)
  const [resource, setResource] = useState(userModule.user.resource)
  const [wallLevelState, setWallLevelState] = useState(userModule.user.wall)
  const [needMeat, setNeedMeat] = useState(5);
  const [needEgg, setNeedEgg] = useState(1);
  const [btnStatus, setBtnStatus] = useState(false);
  const [convertTimeRemained, setConvertTimeRemained] = useState(0);
  const [convertCooldown, setConvertCooldown] = useState(false);
  const [convertBtn, setConvertBtn] = useState("Start");

  const [openInstruction, setOpenInstruction] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    if (user.resource < needMeat || user.eggs < needEgg) {
      setBtnStatus(false);
    } else {
      setBtnStatus(true)
    }
  }, [openBird])

  useEffect(() => {
    if (global.wall === 0) {
      history.back();
    }
    const handleWindowResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  })

  const TEST_MODE = true
  const { connected, chainID, address, connect } = useWeb3Context()
  
  const [openSwap, setOpenSwap] = useState(false)
  const [openUpgradeWall, setOpenUpgradeWall] = useState(false)
  const [openRock, setOpenRock] = useState(false)
  const [openDeposit, setOpenDeposit] = useState(false)
  const [openMining, setOpenMining] = useState(false)
  const [levelState, setLevelState] = React.useState(global.level)
  

  const [btnTitle, setBtnTitle] = useState("START")
  const [items, setItems] = useState([
    { counting: 0, timer: 0, },
    { counting: 0, timer: 0, },
    { counting: 0, timer: 0, },
  ])

  const [birds, setBirds] = useState([
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
  ])
  const diamonds = [1, 2]

  const [selectedIndex, setSelectedIndex] = useState(0)

  var convertSecToHMS = (number: number) => {
    const hours = Math.floor(number / 3600)
      .toString()
      .padStart(2, '0')
    const minutes = Math.floor((number % 3600) / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (number % 60).toString().padStart(2, '0')
    const formattedTime = `${minutes}:${seconds}`/*${hours}:*/
    return formattedTime
  }
  const showModal = (index: any) => {
    if (Drg < 20) {
      return
    }
    setSelectedIndex(index)
    handleOpen()
  }

  const showBirdModal = () => {
    handleBirdOpen()
  }

  const onRockStart = (cooldown: any) => {
    dispatch(
      stakeDiamond(address, selectedIndex, cooldown, (res: any) => {
        if (res.success === false) return
        setDrg(res.data)
        handleClose()
        coolDownStatus(cooldown)
      }),
    )
  }
  useEffect(() => {
    coolDownStatus(selectedIndex)
  }, [selectedIndex])
  const coolDownStatus = (cooldown: any) => {
    dispatch(
      checkCooldown(address, `diamond${selectedIndex + 1}`, (res: any) => {
        let cooldownSec = res.data
        const _items = [...items]
        _items[selectedIndex].timer = res.data
        _items[selectedIndex].counting = 1
        setItems(_items)
        if (cooldownSec === 999999) {
          _items[selectedIndex].timer = 0
        }
        else if (cooldownSec <= 0) {
          _items[selectedIndex].timer = 0
          setBtnTitle("CLAIM")
        }
        else {
          _items[selectedIndex].timer = cooldownSec
        }
      }),
    )
  }

  const onConvert = () => {
    if (convertCooldown === false) {
      if (convertBtn === "Start") {
        dispatch(
          setCooldown(address, 'convertor', true, (res: any) => {
            setResource(res.data.resource);
            setEggs(res.data.eggs);
            setConvertCooldown(true);
            setConvertTimeRemained(30);
          })
        )
      } else if (convertBtn === "Claim") {
        dispatch(convertDrg(address, (res: any) => {
          setDrg(res.data.drg)
          setConvertBtn('Start')
        }))
        setConvertBtn('Start')
        setConvertCooldown(false)
        setOpenBird(false)
      }
    }
  }

  useEffect(() => {
    if (convertCooldown) {
      var convertCldInterval = setInterval(() => {
        setConvertTimeRemained((prevTime) => {
          if (prevTime === 1) {
            setConvertBtn('Claim')
          }
          if (prevTime === 0) {
            clearInterval(convertCldInterval)
            setConvertCooldown(false)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => clearInterval(convertCldInterval)
  }, [convertCooldown])

  useEffect(() => {
    dispatch(
      checkCooldown(address, 'convertor', (res: any) => {
        let cooldownSec = res.data
        if (cooldownSec === 999999) {
          // if(miningStatus === false) return
          // setBtnType('Start')
        }
        else if (cooldownSec <= 0) {
          setConvertTimeRemained(0);
          setConvertBtn("Claim");
        }
        else {
          setConvertTimeRemained(cooldownSec)
          setConvertCooldown(true)
        }
      }),
    )
  }, [openBird])

  const setBirdItem = (index: any, item: any) => {
    if (Drg < 20) return
    dispatch(
      stakeBird(address, index, (res: any) => {
        if (res.success === false) return
        const _items = [...birds]
        _items[index].item = item
        _items[index].timer = STAKE_TIMER
        setBirds(_items)
      }),
    )
  }

  const onRockClaim = () => {
    if (items[selectedIndex].counting !== 0 && items[selectedIndex].timer === 0) {
      setOpenRock(false)
      onClaim(selectedIndex)
    } else alert('please wait...')
  }

  const onClaim = (index: number) => {
    dispatch(
      claimDiamond(address, index, (res: any) => {
        if (res.success === false) return setResource(resource)
        const _items = [...items]
        _items[index].counting = 0
        _items[index].timer = 0
        if (typeof res.data.resource === 'number') setResource(res.data.resource)
        setItems(_items)
        setBtnTitle("START")
      }),
    )
  }

  const onClaimBird = (e: any, index: number) => {
    e.stopPropagation()

    dispatch(
      claimBird(address, index, (res: any) => {
        if (res.success === false) return
        const _items = [...birds]
        _items[index].item = 0
        _items[index].timer = 0
        setBirds(_items)
      }),
    )
  }

  const onExchange = (swapAmount: number) => {
    dispatch(swapResources(address, swapAmount, (res: any) => { }))
    setOpenSwap(false)
  }

  const onExchangeEgg = (swapAmount: number) => {
    dispatch(swapEggs(address, swapAmount, (res: any) => { }))
    setOpenSwap(false)
  }

  const onUpgradeWall = () => {
    dispatch(
      upgradeWall(address, (res: any) => {
        setWallLevelState(res.wall)
        global.wall = res.wall
        setDrg(res.Drg)
      }),
    )
    setOpenUpgradeWall(false)
  }

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpenRock(true)
  const handleClose = () => setOpen(false)

  const handleBirdOpen = () => setOpenBird(true)
  const handleBirdClose = () => setOpenBird(false)
  let timer: any = null
  const startTimer = () => {
    if (timer === null) {
      timer = setInterval(() => {
        setItems((prevItem) => {
          let _item = [...prevItem]
          _item = _item.map((value) => {
            if (value.timer > 0) value.timer--
            return value
          })
          return _item
        })

        setBirds((prevItem) => {
          let _item = [...prevItem]
          _item = _item.map((value) => {
            if (value.timer > 0) value.timer--
            return value
          })
          return _item
        })
      }, 1000)
    }
  }

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 200,
      sm: 400,
      // md: 800,
      md: 665,
    },

    border: 'none',
    outline: 'none',
    // maxHeight: '500px',
    // overflow: 'auto',
    overflow: 'initial',
    // boxShadow: 24,
    // p: 4,
  }

  useEffect(() => {
    startTimer()

    return () => clearInterval(timer)
  }, [JSON.stringify(items)])

  // set staked diamond
  useEffect(() => {
    if (user.stakedDiamond && user.stakedDiamond.length > 0) {
      const _items = [...items]
      for (const dt of user.stakedDiamond) {
        if (!dt || dt.position > 7) continue

        const date = new Date()
        const curSec = date.getTime()
        const endSec = new Date(dt.staked_at).getTime()

        const eDate = new Date(dt.staked_at)

        _items[dt.position].counting = dt.diamond
        _items[dt.position].timer =
          STAKE_TIMER - Math.floor((curSec - endSec) / 1000)
        if (_items[dt.position].timer < 0) _items[dt.position].timer = 0
      }
      setItems(_items)
    }
  }, [JSON.stringify(user.stakedDiamond)])

  useEffect(() => {
    if (user.stakedBirds && user.stakedBirds.length > 0) {
      const _items = [...birds]
      for (const dt of user.stakedBirds) {
        if (!dt) continue
        if (dt.position >= 10) continue

        const date = new Date()
        const curSec = date.getTime()
        const endSec = new Date(dt.staked_at).getTime()

        _items[dt.position].item = 1
        _items[dt.position].timer =
          STAKE_TIMER - Math.floor((curSec - endSec) / 1000)
        if (_items[dt.position].timer < 0) _items[dt.position].timer = 0
      }
      setBirds(_items)
    }
  }, [JSON.stringify(user.stakedBirds)])

  return (
    <>
      <Box className="Main">
        <Header
          showAccount={showAccount}
          setShowAccount={setShowAccount}
          Drg={Drg}
          eggs={eggs}
          resource={resource}
        />

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...style, width: { sm: 400, md: 400 } }}>
            <Grid container spacing={3}>
              {diamonds.map((item, index) => (
                <Grid
                  item
                  key={index}
                  xs={6}
                  sm={6}
                  md={6}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: '100px',
                      cursor: 'pointer',
                    }}
                  >
                    {item === 1 && <img alt="" src="/images/diamond_1.png" />}
                    {item === 2 && <img alt="" src="/images/diamond_2.png" />}

                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        sx={{
                          padding: '10px 4px',
                        }}
                        variant="contained"
                        color="success"
                        onClick={(e) => onRockStart(item)}
                      >
                        20 Drg
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Modal>

        <Modal
          open={openBird}
          // open={true}
          onClose={handleBirdClose}
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
                width: '6%',
                transform: 'translate(26%, -27%)',
                cursor: 'pointer',
                zIndex: 5,
              }}
              onClick={handleBirdClose}
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
                  <p>CONVERTER</p>
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
                <Grid item xs={4} sx={{ padding: '0 !important' }}>
                  <Stack
                    sx={{
                      fontFamily: 'CubicPixel',
                      fontSize: '30px',
                      width: '200%',
                      marginLeft: "-50%",
                      fontWeight: 'bold',
                      color: '#e7e1e1',
                      textAlign: 'center',
                      marginTop: "-20px"
                    }}
                  >
                    <p>YOU WILL RECEIVE:</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div
                        style={{
                          width: '100px', height: '100px',
                          lineHeight: '1',
                          backgroundImage: 'radial-gradient(farthest-corner at 30px 70px,#71923c, #ebd8c2 )',
                          padding: '23px 0',
                          margin: "10px",
                          border: "3px solid black",
                          borderRadius: '23px',
                          fontSize: "smaller"
                        }}
                      >
                        <p>50~150<br />DRG</p>
                      </div>
                    </div>
                  </Stack>
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                }}
              >
                {
                  btnStatus === true ?
                    <Button
                      onClick={() => onConvert()}
                      sx={{
                        width: '200px',
                        marginTop: "30px",

                      }}
                    >
                      <img alt="" src="/assets/images/big-button.png" />
                      <p
                        style={{
                          position: 'absolute',
                          fontFamily: 'CubicPixel',
                          fontSize: '25px',
                          textAlign: 'center',
                          color: '#e7e1e1',

                        }}
                      >
                        {convertTimeRemained === 0 ? convertBtn : convertSecToHMS(convertTimeRemained)}
                      </p>
                    </Button>
                    :
                    <Button
                      sx={{
                        width: '200px',
                        marginTop: "30px",
                      }}
                      disabled
                    >
                      <img alt="" src="/assets/images/big-button.png" />
                      <p
                        style={{
                          position: 'absolute',
                          fontFamily: 'CubicPixel',
                          fontSize: '25px',
                          textAlign: 'center',
                          color: '#e7e1e1',

                        }}
                      >
                        Start
                      </p>
                    </Button>
                }
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'absolute',
                  bottom: '6%',
                  width: '100%'
                }}
              >
                <div
                  style={{
                    fontFamily: 'CubicPixel',
                    fontSize: '30px',
                    fontWeight: 'bold',
                    color: '#e7e1e1',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <p>NEED FOR START:</p>
                  <div
                    style={{
                      width: "70px", height: '55px',
                      border: '1px solid black',
                      borderRadius: '25px',
                      backgroundColor: '#f670ec',
                      padding: '5px',
                      marginLeft: '10px',
                      display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                    <img src='assets/images/meat.png' width={"50px"} />
                    <p style={{ position: 'absolute', top: '15px', fontSize: '25px' }}>x{needMeat}</p>
                  </div>
                  <div
                    style={{
                      width: "70px", height: '55px',
                      border: '1px solid black',
                      borderRadius: '25px',
                      backgroundColor: '#f670ec',
                      padding: '5px',
                      marginLeft: '10px',
                      display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                    <img src='assets/images/egg.png' width={"50px"} />
                    <p style={{ position: 'absolute', top: '15px', fontSize: '25px' }}>x{needEgg}</p>
                  </div>
                </div>
              </Box>
            </Box>
          </Box>
        </Modal >

        <ExchangeModal
          open={openSwap}
          setOpen={setOpenSwap}
          Drg={Drg}
          egg={eggs}
          setDrg={setDrg}
          setEgg={setEggs}
        />
        <UpgradeWallModal
          open={openUpgradeWall}
          setOpen={setOpenUpgradeWall}
          setWall={onUpgradeWall}
        />
        <RockModal
          openRock={openRock}
          counting={items[selectedIndex].counting}
          timer={items[selectedIndex].timer}
          setOpen={setOpenRock}
          onRock={() => onRockStart(1)}
          setRockClaim={onRockClaim}
          btnTitle={btnTitle}
        />
        <DepositModal
          open={openDeposit}
          setOpen={setOpenDeposit}
          resource={resource}
          egg={eggs}
          onExchange={onExchange}
          onExchangeEgg={onExchangeEgg}
        />
        <MiningModal
          open={openMining}
          setOpen={setOpenMining}
          drgAmount={Drg}
          setDrgAmount={setDrg}
          resource={resource}
          egg={eggs}
          setEggs={setEggs}
          levelState={levelState}
          setLevelState={setLevelState}
          onExchange={onExchange}
          onExchangeEgg={onExchangeEgg}
        />

        <InstructionModal open={openInstruction} setOpen={setOpenInstruction} />

        <Box
          sx={{
            pointerEvents: `${TEST_MODE || connected ? '' : 'none'}`,
            height: '90%',
          }}
        >
          <div
            className="wall-wallet"
          // style={{ backgroundImage:"url('/images/border"+(wallLevelState)+".png')" }}
          >
            <img
              src={'assets/images/border' + wallLevelState + '.png'}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                cursor: 'pointer'
              }}
              onClick={() => setOpenUpgradeWall(true)}
              className={styles.item}
            />
            <Box
              sx={{
                width: '50%',
                paddingTop: '50vh',
                // transform: 'translateY(-20vh)',                

                justifyContent: 'space-between',
                margin: 'auto',
                display: 'flex',
                zIndex: 20,
              }}
            >
              <Box
                sx={{
                  cursor: 'pointer',
                  transform: 'translateY(-100px)',
                  height: 'fit-content',

                  zIndex: 20,
                }}
                onClick={(e) => setOpenSwap(true)}
              >
                <img alt="" src="/images/storage.png" style={{ transform: 'translate(-50%, -50%)' }} className={styles.item} />
              </Box>
              <Box
                sx={{
                  cursor: 'pointer',
                  transform: 'translate(20px, 20px)',
                  height: 'fit-content',
                  zIndex: 20,
                }}
                onClick={(e) => setOpenDeposit(true)}
              >
                <img alt="" src="/images/home.png" style={{ transform: 'translate(-50%, -50%)', maxWidth: '250px' }} className={styles.item} />
              </Box>
              <Box
                sx={{
                  // left: `${Math.max(innerWidth, 1200) / 2 - 75}px`,
                  zIndex: 20,
                  transform: 'translateY(200px)',
                  height: 'fit-content',
                  width: 'fit-content',

                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  showBirdModal()
                }}
              >
                <img
                  alt=""
                  className={styles.item}
                  style={{ transform: 'translate(-5%, -115%)' }}
                  width={'80%'}
                  src={`/images/bird_place.png`}
                />
              </Box>
              <Box
                sx={{
                  zIndex: 20,
                  transform: 'translate(100%, -180px)',
                  height: 'fit-content',
                  cursor: 'pointer',
                }}
                onClick={(e) => setOpenMining(true)}
              >
                <img alt="" src="/images/mining.png" style={{ transform: 'translate(-50%, -50%)' }} className={styles.item} />
              </Box>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                display: 'flex',
                width: '30%',
                margin: 'auto',
                top: '25%',
                left: '50%',
                transform: "translateX(-50%)"
              }}
            >
              {items.map((item, index) => (
                <Box
                  sx={{

                    // left:
                    //   windowSize.width < MIN_SCREEN
                    //     ? MIN_SCREEN - parseInt(item.posy, 10) - 30 + 'px'
                    //     : Math.max(900, windowSize.width - 450 ) - parseInt(item.posy, 10) + 'px',
                    cursor: 'pointer',
                    margin: 'auto',
                  }}
                  onClick={(e) => {
                    showModal(index)
                  }}
                  key={index}
                >
                  {/* {item.item === 0 ? ( */}
                  <Box
                    sx={{
                      zIndex: 10,
                      transform: index === 1 ? 'translateY(-30%) ' : index === 2 ? 'translateY(30%) ' : ''
                    }}
                  >
                    <img
                      alt=""
                      className={styles.item}
                      width={'100'}
                      // width={index===1?150:100}
                      src={`/images/place_1.png`}
                    />
                  </Box>
                </Box>
              ))}
            </Box>

            {/* </div> */}
          </div>
        </Box>

        <Box
          sx={{
            zIndex: 20,
            height: 'fit-content',
            width: 'fit-content',
          }}
        >
          <img
            alt=""
            style={{ position: 'absolute', left: '2%', top: '55%' }}
            src={`/images/greentree1.png`}
          />
        </Box>
        <Box
          sx={{
            zIndex: 20,
            height: 'fit-content',
            width: 'fit-content',
          }}
        >
          <img
            alt=""
            style={{ position: 'absolute', left: '15%', top: '65%', width: '280px', height: '300px' }}
            src={`/images/pinktree.png`}
          />
        </Box>
        <Box
          sx={{
            zIndex: 20,
            height: 'fit-content',
            width: 'fit-content',
          }}
        >
          <img
            alt=""
            style={{ position: 'absolute', right: '5%', top: '55%', }}
            src={`/images/greentree2.png`}
          />
        </Box>
        <Box
          sx={{
            zIndex: 20,
            height: 'fit-content',
            width: 'fit-content',
          }}
        >
          <img
            alt=""
            style={{ position: 'absolute', left: '50%', bottom: '-5%', }}
            src={`/images/rock.png`}
          />
        </Box>
      </Box >

      <Box
        className={styles.loginbg}
        sx={{
          display: TEST_MODE || connected ? 'none' : 'block',
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(0, -50%)',
            justifyContent: 'center',
            width: '100vw',
            display: 'flex',
          }}
        >
          <Box
            sx={{
              width: '12vw',
              minWidth: '100px',
              maxWidth: '180px',
            }}
          >
            <img alt="" src="/images/login_icon.png" />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box className={styles.icon_buttons}>
              <Button
                sx={{ mb: 1, width: '100%' }}
                variant="contained"
                color="success"
                onClick={(e) => {
                  connect()
                }}
              >
                <img alt="" src="/images/icon_metamask.png" />
                Connect Metamask
              </Button>
            </Box>
            <Box className={styles.icon_buttons}>
              <a
                className={styles.link}
                href="https://pancakeswap.finance/swap?outputCurrency=BNB&inputCurrency=0xc6D542Ab6C9372a1bBb7ef4B26528039fEE5C09B"
              >
                <Button
                  sx={{ width: '100%', justifyContent: 'left', mb: 1 }}
                  variant="contained"
                  color="success"
                >
                  <img alt="" src="/images/icon_bcs.png" />
                  Buy/Sell BCS
                </Button>
              </a>
            </Box>
            <Box className={styles.icon_buttons}>
              <Button
                sx={{ width: '100%', justifyContent: 'left', mb: 1 }}
                variant="contained"
                color="success"
                onClick={(e) => {
                  setOpenInstruction(true)
                }}
              >
                <img alt="" src="/images/icon_youtube.png" />
                INSTRUCTION
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Main
