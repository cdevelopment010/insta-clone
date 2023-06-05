
import { useState, useEffect } from "react"
import Avatar from "./Avatar"
import Menu from "./Menu";

import '../Styles/home.css';

export default function Home() {

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile(window.innerWidth > 768 ? false : true);
        window.addEventListener("resize",checkMobile)
        return () => window.removeEventListener("resize", checkMobile);
    })

    function checkMobile() {
        setIsMobile(window.innerWidth > 768 ? false : true); 
    }

    if (isMobile){
        return (
            <div className="mobile-container">
                <div className="mobile-nav-header"></div>
                <div className="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc iaculis ultricies iaculis. Sed ut sollicitudin nisi. Nullam vel nisi a tortor tincidunt fringilla. Etiam quis bibendum felis, sit amet aliquet turpis. Sed finibus metus felis. Fusce auctor id mi id dapibus. Sed maximus, quam in luctus ultricies, tellus odio bibendum nisl, vitae rutrum mauris mi ac turpis.</p>
                <p>Morbi quis dolor at tellus porttitor consequat sit amet eget libero. Ut et est commodo, interdum velit in, suscipit velit. Etiam lacinia, erat et ultrices sollicitudin, mauris metus luctus dolor, lacinia sagittis dui enim eget metus. Proin rhoncus, justo sit amet condimentum cursus, lectus massa sagittis turpis, et porttitor est ipsum quis justo. Ut eleifend tortor at iaculis mollis. Phasellus vel ante sit amet eros sagittis ullamcorper. Mauris eget arcu vel nunc interdum ornare eget vel tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in tristique felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce dapibus lectus quis mauris vulputate, sed elementum est facilisis.</p>
                <p>Mauris et scelerisque eros. Cras et scelerisque tortor. Sed risus augue, bibendum nec nulla a, aliquet hendrerit nunc. Aliquam pulvinar, erat iaculis hendrerit molestie, dui leo dictum urna, et laoreet ipsum tortor eget augue. Donec ornare fermentum facilisis. Donec sit amet ullamcorper mauris, non fringilla nisl. Suspendisse condimentum fermentum ornare. Nam sit amet massa vitae magna vehicula condimentum. Phasellus leo felis, bibendum quis dui et, eleifend tempus sem.</p>
                <p>Fusce eu commodo ipsum. Fusce efficitur iaculis varius. Aliquam vestibulum ipsum quam, et facilisis erat interdum id. Quisque malesuada neque at ex faucibus dignissim. Fusce ultricies sit amet sem a tempor. Nunc pretium libero felis, non consequat justo pretium sit amet. Curabitur ultrices quam erat, quis dignissim lorem faucibus sit amet. Fusce a sapien sit amet massa volutpat facilisis at dapibus urna. Duis efficitur tincidunt quam eu iaculis. Morbi consequat sit amet lacus pretium euismod. Phasellus non felis orci. Vivamus a porttitor purus. Integer ullamcorper libero hendrerit efficitur tristique. Maecenas in sem a libero scelerisque tincidunt eu consequat ligula.</p>
                <p>Phasellus consequat arcu nec iaculis luctus. Etiam vel nisi nec arcu vehicula bibendum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed aliquam dapibus accumsan. Proin ac ullamcorper turpis. Integer bibendum maximus mi eleifend imperdiet. Cras ut dui mattis, maximus sapien non, sagittis sapien. Integer commodo arcu in nisl ultricies porttitor. In hac habitasse platea dictumst. Cras ut tortor elit.</p>
                    
                </div>
                <div className="mobile-nav-footer">
                    <ul className="d-flex align-items-center justify-content-evenly h-100">
                        <li className="menu-item"><img src="/Icons/svg/home-solid.svg" alt=""/></li>
                        <li className="menu-item"><img src="/Icons/svg/search-regular.svg" alt=""/></li>
                        <li className="menu-item"><img src="/Icons/svg/instagram-reels-regular.svg" alt=""/></li>
                        <li className="menu-item"><img src="/Icons/svg/instagram-share-regular.svg" alt=""/></li>
                        <li className="menu-item"><Avatar /></li>
                    </ul>
                </div>
            </div>
        )

    } else {
        return (
            <div className="desktop-container">
                <Menu/>
                <div className="content"></div>
            </div>
        )
    }
}