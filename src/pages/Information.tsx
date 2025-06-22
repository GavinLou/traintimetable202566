import { Box, Heading, Text } from "@chakra-ui/react";

export default function Information() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
                <Heading size="lg" mb={6} textAlign="center">本網站各頁面功能、資料來源與技術說明</Heading>

                <Box mb={8}>
                    <Heading size="md" mb={2}>Home（首頁）</Heading>
                    <Text mb={1}>功能：</Text>
                    <ul style={{ paddingLeft: 24, marginBottom: 8, listStyle: "disc" }}>
                        <li>網站簡介與導覽，快速連結至各主要功能頁</li>
                        <li>顯示台鐵最新消息（如即時公告、異動資訊）</li>
                    </ul>
                    <Text color="gray.500" fontSize="sm">
                        API：<br />
                        - <b>/Rail/TRA/News</b>（台鐵最新消息）<br />
                        - 其他靜態內容
                    </Text>
                    <Text color="gray.500" fontSize="sm" mt={1}>
                        UI：Chakra UI + Tailwind CSS
                    </Text>
                </Box>

                <Box mb={8}>
                    <Heading size="md" mb={2}>Buyticket（線上訂票）</Heading>
                    <Text mb={1}>功能：</Text>
                    <ul style={{ paddingLeft: 24, marginBottom: 8, listStyle: "disc" }}>
                        <li>查詢台鐵班次與票價（依出發/到達站、日期、車種篩選）</li>
                        <li>顯示每班車詳細時刻、票價</li>
                        <li>下載個人化電子票券（TXT）</li>
                    </ul>
                    <Text color="gray.500" fontSize="sm">
                        API：<br />
                        - <b>/Rail/TRA/Station</b>（取得所有車站）<br />
                        - <b>/Rail/TRA/DailyTrainTimetable/OD/</b>（查詢班次）<br />
                        - <b>/Rail/TRA/ODFare/</b>（查詢票價）
                    </Text>
                    <Text color="gray.500" fontSize="sm" mt={1}>
                        UI：Chakra UI + Tailwind CSS<br />
                        票券產生：純前端文字檔（txt）
                    </Text>
                </Box>

                <Box mb={8}>
                    <Heading size="md" mb={2}>Trainmap（路線圖）</Heading>
                    <Text mb={1}>功能：</Text>
                    <ul style={{ paddingLeft: 24, marginBottom: 8, listStyle: "disc" }}>
                        <li>顯示台鐵全線路線圖，支援放大縮小</li>
                        <li>可點擊站點查看詳細資訊</li>
                        <li>顯示各路線顏色與名稱</li>
                    </ul>
                    <Text color="gray.500" fontSize="sm">
                        API：<br />
                        - <b>/Rail/TRA/Station</b>（取得所有車站）<br />
                        - <b>/Rail/TRA/Line</b>（取得路線資料）
                    </Text>
                    <Text color="gray.500" fontSize="sm" mt={1}>
                        UI：Chakra UI + Tailwind CSS + SVG
                    </Text>
                </Box>

                <Box mb={8}>
                    <Heading size="md" mb={2}>Stationmap（車站地圖）</Heading>
                    <Text mb={1}>功能：</Text>
                    <ul style={{ paddingLeft: 24, marginBottom: 8, listStyle: "disc" }}>
                        <li>地圖顯示所有車站位置（Google Maps 或 Leaflet）</li>
                        <li>可搜尋並定位特定車站，顯示詳細資訊</li>
                    </ul>
                    <Text color="gray.500" fontSize="sm">
                        API：<br />
                        - <b>/Rail/TRA/Station</b>（取得所有車站，含經緯度）
                    </Text>
                    <Text color="gray.500" fontSize="sm" mt={1}>
                        UI：Chakra UI + Tailwind CSS<br />
                        地圖：Google Maps API 或 Leaflet
                    </Text>
                </Box>

                <Box mb={8}>
                    <Heading size="md" mb={2}>Search（班次查詢）</Heading>
                    <Text mb={1}>功能：</Text>
                    <ul style={{ paddingLeft: 24, marginBottom: 8, listStyle: "disc" }}>
                        <li>查詢指定區間、日期的所有班次</li>
                        <li>可依車種篩選、顯示出發/到達時間</li>
                        <li>支援快速查詢與友善操作介面</li>
                    </ul>
                    <Text color="gray.500" fontSize="sm">
                        API：<br />
                        - <b>/Rail/TRA/Station</b>（取得所有車站）<br />
                        - <b>/Rail/TRA/DailyTrainTimetable/OD/</b>（查詢班次）
                    </Text>
                    <Text color="gray.500" fontSize="sm" mt={1}>
                        UI：Chakra UI + Tailwind CSS
                    </Text>
                </Box>
            </div>
        </div>
    );
}