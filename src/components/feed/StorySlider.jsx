import React, { useRef, useState } from 'react';

function useDragScroll() {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const startDrag = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const stopDrag = () => {
    setIsDragging(false);
  };
  const onDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return { scrollRef, isDragging, startDrag, stopDrag, onDrag };
}

export default function StorySlider() {
  const desktopDrag = useDragScroll();
  const mobileDrag = useDragScroll();

  const scrollStories = (direction) => {
    if (desktopDrag.scrollRef.current) {
      const scrollAmount = 300;
      desktopDrag.scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <style>{`
        ._feed_inner_ppl_card .row.flex-nowrap::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
        ._feed_inner_ppl_card_area_list::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* For Desktop */}
      <div className="_feed_inner_ppl_card _mar_b16" style={{ position: 'relative' }}>
        <div className="_feed_inner_story_arrow" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
          <button type="button" className="_feed_inner_story_arrow_btn" onClick={() => scrollStories('right')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
              <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
            </svg>
          </button>
        </div>
        <div
          className="row flex-nowrap m-0"
          ref={desktopDrag.scrollRef}
          onMouseDown={desktopDrag.startDrag}
          onMouseLeave={desktopDrag.stopDrag}
          onMouseUp={desktopDrag.stopDrag}
          onMouseMove={desktopDrag.onDrag}
          style={{
            overflowX: 'auto',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE/Edge */
            cursor: desktopDrag.isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            paddingBottom: '5px'
          }}
        >
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col px-2">
            <div className="_feed_inner_profile_story _b_radious6 ">
              <div className="_feed_inner_profile_story_image">
                <img src="/src/assets/images/card_ppl1.png" alt="Image" className="_profile_story_img" draggable="false" />
                <div className="_feed_inner_story_txt">
                  <div className="_feed_inner_story_btn">
                    <button className="_feed_inner_story_btn_link">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                        <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                      </svg>
                    </button>
                  </div>
                  <p className="_feed_inner_story_para">Your Story</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col px-2">
            <div className="_feed_inner_public_story _b_radious6">
              <div className="_feed_inner_public_story_image">
                <img src="/src/assets/images/card_ppl2.png" alt="Image" className="_public_story_img" draggable="false" />
                <div className="_feed_inner_pulic_story_txt">
                  <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                </div>
                <div className="_feed_inner_public_mini">
                  <img src="/src/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" draggable="false" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col px-2">
            <div className="_feed_inner_public_story _b_radious6">
              <div className="_feed_inner_public_story_image">
                <img src="/src/assets/images/card_ppl3.png" alt="Image" className="_public_story_img" draggable="false" />
                <div className="_feed_inner_pulic_story_txt">
                  <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                </div>
                <div className="_feed_inner_public_mini">
                  <img src="/src/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" draggable="false" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col px-2">
            <div className="_feed_inner_public_story _b_radious6">
              <div className="_feed_inner_public_story_image">
                <img src="/src/assets/images/card_ppl4.png" alt="Image" className="_public_story_img" draggable="false" />
                <div className="_feed_inner_pulic_story_txt">
                  <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                </div>
                <div className="_feed_inner_public_mini">
                  <img src="/src/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" draggable="false" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col px-2">
            <div className="_feed_inner_public_story _b_radious6">
              <div className="_feed_inner_public_story_image">
                <img src="/src/assets/images/card_ppl3.png" alt="Image" className="_public_story_img" draggable="false" />
                <div className="_feed_inner_pulic_story_txt">
                  <p className="_feed_inner_pulic_story_para">Alice Johnson</p>
                </div>
                <div className="_feed_inner_public_mini">
                  <img src="/src/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" draggable="false" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col px-2">
            <div className="_feed_inner_public_story _b_radious6">
              <div className="_feed_inner_public_story_image">
                <img src="/src/assets/images/card_ppl2.png" alt="Image" className="_public_story_img" draggable="false" />
                <div className="_feed_inner_pulic_story_txt">
                  <p className="_feed_inner_pulic_story_para">Mark Smith</p>
                </div>
                <div className="_feed_inner_public_mini">
                  <img src="/src/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" draggable="false" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col px-2">
            <div className="_feed_inner_public_story _b_radious6">
              <div className="_feed_inner_public_story_image">
                <img src="/src/assets/images/card_ppl4.png" alt="Image" className="_public_story_img" draggable="false" />
                <div className="_feed_inner_pulic_story_txt">
                  <p className="_feed_inner_pulic_story_para">Bob Builder</p>
                </div>
                <div className="_feed_inner_public_mini">
                  <img src="/src/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" draggable="false" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col px-2">
            <div className="_feed_inner_public_story _b_radious6">
              <div className="_feed_inner_public_story_image">
                <img src="/src/assets/images/card_ppl2.png" alt="Image" className="_public_story_img" draggable="false" />
                <div className="_feed_inner_pulic_story_txt">
                  <p className="_feed_inner_pulic_story_para">Charlie Day</p>
                </div>
                <div className="_feed_inner_public_mini">
                  <img src="/src/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" draggable="false" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* For Desktop End */}

      {/* For Mobile */}
      <div className="_feed_inner_ppl_card_mobile _mar_b16" style={{ marginTop: '16px' }}>
        <div className="_feed_inner_ppl_card_area">
          <ul
            className="_feed_inner_ppl_card_area_list"
            ref={mobileDrag.scrollRef}
            onMouseDown={mobileDrag.startDrag}
            onMouseLeave={mobileDrag.stopDrag}
            onMouseUp={mobileDrag.stopDrag}
            onMouseMove={mobileDrag.onDrag}
            style={{
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              cursor: mobileDrag.isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              display: 'flex', // Ensure items are arranged horizontally for drag scrolling
              flexWrap: 'nowrap',
              paddingBottom: '5px'
            }}
          >
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story">
                  <img src="/src/assets/images/mobile_story_img.png" alt="Image" className="_card_story_img" draggable="false" />
                  <div className="_feed_inner_ppl_btn">
                    <button className="_feed_inner_ppl_btn_link" type="button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                        <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="_feed_inner_ppl_card_area_link_txt">Your Story</p>
              </a>
            </li>
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story_active">
                  <img src="/src/assets/images/mobile_story_img1.png" alt="Image" className="_card_story_img1" draggable="false" />
                </div>
                <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
              </a>
            </li>
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story_inactive">
                  <img src="/src/assets/images/mobile_story_img2.png" alt="Image" className="_card_story_img1" draggable="false" />
                </div>
                <p className="_feed_inner_ppl_card_area_txt">Alice...</p>
              </a>
            </li>
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story_inactive">
                  <img src="/src/assets/images/mobile_story_img1.png" alt="Image" className="_card_story_img1" draggable="false" />
                </div>
                <p className="_feed_inner_ppl_card_area_txt">Mark...</p>
              </a>
            </li>
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story_inactive">
                  <img src="/src/assets/images/mobile_story_img2.png" alt="Image" className="_card_story_img1" draggable="false" />
                </div>
                <p className="_feed_inner_ppl_card_area_txt">Charlie...</p>
              </a>
            </li>
            {/* Added more mobile items to allow obvious scrolling */}
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story_inactive">
                  <img src="/src/assets/images/mobile_story_img1.png" alt="Image" className="_card_story_img1" draggable="false" />
                </div>
                <p className="_feed_inner_ppl_card_area_txt">Eve...</p>
              </a>
            </li>
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story_inactive">
                  <img src="/src/assets/images/mobile_story_img2.png" alt="Image" className="_card_story_img1" draggable="false" />
                </div>
                <p className="_feed_inner_ppl_card_area_txt">Sam...</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* For Mobile End */}
    </>
  );
}
