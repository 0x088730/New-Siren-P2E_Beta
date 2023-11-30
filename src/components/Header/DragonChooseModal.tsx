import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch, ReactReduxContext } from 'react-redux'
import { global } from '../../common/global'
import "./modal.css"
import { buyDragon } from '../../store/user/actions'
import { useWeb3Context } from '../../hooks/web3Context'
import { getProfile } from '../../common/api'

interface Props {
  dragonChooseModalOpen: any
  setDragonChooseModalOpen: any
  cardNum: any
  setDrg: any
  cardImg: any
  setCardImg: any
  setRewardAmount: any
}

const DragonChooseModal = ({
  dragonChooseModalOpen,
  setDragonChooseModalOpen,
  cardNum,
  setDrg,
  cardImg,
  setCardImg,
  setRewardAmount,
}: Props) => {
  const dispatch = useDispatch<any>()
  const { address } = useWeb3Context();

  useEffect(() => {
    if (global.dragons.length === 1) {
      setBuyedGoldDragon(false);
      setBuyedPinkDragon(false);
      setBuyedDarkDragon(false);
    }
    if (global.dragons.length === 2) {
      setBuyedGoldDragon(true);
      setBuyedPinkDragon(false);
      setBuyedDarkDragon(false);
    }
    if (global.dragons.length === 3) {
      setBuyedGoldDragon(true);
      setBuyedPinkDragon(true);
      setBuyedDarkDragon(false);
    }
    if (global.dragons.length === 4) {
      setBuyedGoldDragon(true);
      setBuyedPinkDragon(true);
      setBuyedDarkDragon(true);
    }
  }, [dragonChooseModalOpen])

  const [buyedGoldDragon, setBuyedGoldDragon] = useState(false);
  const [buyedPinkDragon, setBuyedPinkDragon] = useState(false);
  const [buyedDarkDragon, setBuyedDarkDragon] = useState(false);
  const [reward1, setReward1] = useState(0);
  const [reward2, setReward2] = useState(0);
  const [reward3, setReward3] = useState(0);

  const onBuyDragon = (name: any, num: any) => {
    if (address !== '') {
      dispatch(
        buyDragon(address, { dragonName: name, dragonNo: num }, (res: any) => {
          if (res.data.name === name) {
            if (name === "gold_dragon") setBuyedGoldDragon(true);
            if (name === 'pink_dragon') setBuyedPinkDragon(true);
            if (name === 'dark_dragon') setBuyedDarkDragon(true);
            getProfile(address, "dragon")
            setDrg(res.data.drg);
          }
        }),
      )
    }
  }
  const selectDragon = (order: any, url: any) => {
    let rndValue = Math.floor(Math.random() * 100);

    if(order === "1") {
      if(rndValue > 70) {
        setReward1(30);
      } else if ( rndValue > 20 && rndValue <= 70) {
        setReward1(20);
      } else {
        setReward1(10);
      }
    }
    if(order === "2") {
      if(rndValue > 50) {
        setReward2(10);
      } else if ( rndValue > 30 && rndValue <= 50) {
        setReward2(20);
      } else {
        setReward2(20);
      }
    }
    if(order === "3") {
      if(rndValue > 50) {
        setReward3(20);
      } else if ( rndValue > 30 && rndValue <= 50) {
        setReward3(30);
      } else {
        setReward3(10);
      }
    }
    if (cardNum === "1") {
      if (cardImg.second.name === order || cardImg.third.name === order) return
      setCardImg({ ...cardImg, first: { name: order, url } });
    }
    if (cardNum === "2") {
      if (cardImg.first.name === order || cardImg.third.name === order) return
      setCardImg({ ...cardImg, second: { name: order, url } });
    }
    if (cardNum === "3") {
      if (cardImg.second.name === order || cardImg.first.name === order) return
      setCardImg({ ...cardImg, third: { name: order, url } });
    }
    setDragonChooseModalOpen(false);
    setRewardAmount(reward1 + reward2 + reward3);
  }
  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 130,
      md: 700,
    },
  }

  return (
    <>
      <Modal
        open={dragonChooseModalOpen}
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
            onClick={() => setDragonChooseModalOpen(false)}
          />
          <Box
            className='displayCenter'
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              padding: "20px"
            }}
          >
            <div
              style={{
                width: '200px', height: '200px',
                margin: '0 5px',
                backgroundImage: `url('/assets/images/dragons/gold_dragon.png')`,
                backgroundSize: 'cover',
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => buyedGoldDragon === false ? null : selectDragon("1", `url('/assets/images/dragons/gold_dragon.png')`)}
            >
              <div style={{ position: 'relative', top: '5px', textAlign: 'left' }}>
                {
                  buyedGoldDragon === false ?
                    <div
                      style={{
                        fontFamily: 'CubicPixel',
                        letterSpacing: '0',
                        fontSize: '17px',
                        color: 'white',
                        textShadow: "2px 2px black",
                        marginLeft: '5px'
                      }}
                    >
                      common-70% <br />
                      rare-20% <br />
                      legendery-10%
                    </div>
                    :
                    <div
                      style={{
                        fontFamily: 'CubicPixel',
                        color: 'white',
                        textShadow: "2px 2px 5px wheat",
                        marginLeft: '5px'
                      }}
                    >
                      COMMON
                    </div>
                }
              </div>
              {
                buyedGoldDragon === false ?
                  <Button
                    onClick={() => onBuyDragon("common", 0)}
                    sx={{
                      width: '180px',
                      height: '60px',
                      marginTop: "20px",
                      position: 'relative',
                      top: '50px',
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
                      BUY
                    </p>
                  </Button>
                  :
                  <div className='levelTitle'>LEVEL: <span style={{ color: '#ff8a00' }}>{`${global.dragons[1] !== undefined ? global.dragons[1].level : "1"}`}</span></div>
              }
            </div>
            <div
              style={{
                width: '200px', height: '200px',
                margin: '0 5px',
                backgroundImage: `url('/assets/images/dragons/pink_dragon.png')`,
                backgroundSize: 'cover',
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => buyedPinkDragon === false ? null : selectDragon("2", `url('/assets/images/dragons/pink_dragon.png')`)}
            >
              <div style={{ position: 'relative', top: '5px', textAlign: 'left' }}>
                {
                  buyedPinkDragon === false ?
                    <div
                      style={{
                        fontFamily: 'CubicPixel',
                        letterSpacing: '0',
                        fontSize: '17px',
                        color: 'white',
                        textShadow: "2px 2px black",
                        marginLeft: '5px'
                      }}
                    >
                      common-50% <br />
                      rare-30% <br />
                      legendery-20%
                    </div>
                    :
                    <div
                      style={{
                        fontFamily: 'CubicPixel',
                        color: 'white',
                        textShadow: "2px 2px 5px wheat",
                        marginLeft: '5px'
                      }}
                    >
                      RARE
                    </div>
                }
              </div>
              {
                buyedPinkDragon === false ?
                  buyedGoldDragon === false ?
                    <Button
                      sx={{
                        width: '180px',
                        height: '60px',
                        marginTop: "20px",
                        position: 'relative',
                        top: '50px',
                      }}
                      disabled
                    >
                      <img alt="" src="/assets/images/big-button.png" style={{ opacity: '0.8' }} />
                      <p
                        style={{
                          position: 'absolute',
                          fontFamily: 'CubicPixel',
                          fontSize: '28px',
                          textAlign: 'center',
                          color: '#e7e1e1',
                          letterSpacing: "2px",
                          opacity: '0.8'
                        }}
                      >
                        BUY
                      </p>
                    </Button>
                    :
                    <Button
                      onClick={() => onBuyDragon("rare", 1)}
                      sx={{
                        width: '180px',
                        height: '60px',
                        marginTop: "20px",
                        position: 'relative',
                        top: '50px',
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
                        BUY
                      </p>
                    </Button>
                  :
                  <div className='levelTitle'>LEVEL: <span style={{ color: '#ff8a00' }}>{`${global.dragons[2] !== undefined ? global.dragons[2].level : "1"}`}</span></div>
              }
            </div>
            <div
              style={{
                width: '200px', height: '200px',
                margin: '0 5px',
                backgroundImage: `url('/assets/images/dragons/dark_dragon.png')`,
                backgroundSize: 'cover',
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => buyedDarkDragon === false ? null : selectDragon("3", `url('/assets/images/dragons/dark_dragon.png')`)}
            >
              <div style={{ position: 'relative', top: '5px', textAlign: 'left' }}>
                {
                  buyedDarkDragon === false ?
                    <div
                      style={{
                        fontFamily: 'CubicPixel',
                        letterSpacing: '0',
                        fontSize: '17px',
                        color: 'white',
                        textShadow: "2px 2px black",
                        marginLeft: '5px'
                      }}
                    >
                      common-20% <br />
                      rare-50% <br />
                      legendery-30%
                    </div>
                    :
                    <div
                      style={{
                        fontFamily: 'CubicPixel',
                        color: 'white',
                        textShadow: "2px 2px 5px wheat",
                        marginLeft: '5px'
                      }}
                    >
                      LEGENDERY
                    </div>
                }
              </div>
              {
                buyedDarkDragon === false ?
                  buyedPinkDragon === false ?
                    <Button
                      sx={{
                        width: '180px',
                        height: '60px',
                        marginTop: "20px",
                        position: 'relative',
                        top: '50px',
                      }}
                      disabled
                    >
                      <img alt="" src="/assets/images/big-button.png" style={{ opacity: '0.8' }} />
                      <p
                        style={{
                          position: 'absolute',
                          fontFamily: 'CubicPixel',
                          fontSize: '28px',
                          textAlign: 'center',
                          color: '#e7e1e1',
                          letterSpacing: "2px",
                          opacity: '0.8'
                        }}
                      >
                        BUY
                      </p>
                    </Button>
                    :
                    <Button
                      onClick={() => onBuyDragon("legendery", 2)}
                      sx={{
                        width: '180px',
                        height: '60px',
                        marginTop: "20px",
                        position: 'relative',
                        top: '50px',
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
                        BUY
                      </p>
                    </Button>
                  :
                  <div className='levelTitle'>LEVEL: <span style={{ color: '#ff8a00' }}>{`${global.dragons[3] !== undefined ? global.dragons[3].level : "1"}`}</span></div>
              }
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default DragonChooseModal
