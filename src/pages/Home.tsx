import { useEffect, useState } from "react";
import { Badge, Box, Button, Card, HStack, Image, Flex, Heading } from "@chakra-ui/react"
import '../index.css'
import { getTDXToken } from "../Token.tsx";

const Home = () => {
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    async function fetchNews() {
      const token = await getTDXToken();
      const res = await fetch("https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/News?%24top=1&%24format=JSON", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAlerts([
        data.Newses[0]?.Description || "測試公告"
      ]);
    }
    fetchNews();
  }, []);

  return (
    <Box>
      {/* 跑馬燈區塊 */}
      <div className="w-full overflow-hidden bg-blue-100 border-b border-blue-200 mb-6">
        <div className="marquee-wrapper">
          <div className="animate-marquee text-blue-700 py-2 px-4 font-semibold">
            {alerts.length > 0
              ? alerts.map((a, i) => (
                <span key={i} className="mx-8">
                  {a}
                </span>
              ))
              : "載入台鐵公告中..."}
          </div>
        </div>
      </div>


      <Flex className="flex flex-col items-center justify-center gap-8">
        <Flex align="center" gap={4} p={3} bg="blue.50" maxW="container.xl">
          <Card.Root flexDirection="row" overflow="hidden" maxW="xl">
            <Image
              objectFit="cover"
              maxW="200px"
              src="1.png"
              alt="Caffe Latte"
            />
            <Box>
              <Card.Body>
                <Card.Title mb="2">行政院通勤月票</Card.Title>
                <Card.Description>
                  票卡有效期限內可不限次數搭乘本案適用車種，惟進、出站僅限於下列車站始符合本案適用範圍。
                </Card.Description>
                <HStack mt="4">
                  <Badge>月票</Badge>
                  <Badge>通勤</Badge>
                </HStack>
              </Card.Body>
              <Card.Footer>
                <Button
                  onClick={() => window.open("https://www.railway.gov.tw/tra-tip-web/tip/tip00C/tipC21/view?proCode=8ae4cac3889508e701889af6ea7904e7&subCode=8ae4cac3889508e701889af83c8404e8", "_blank")}
                >
                  買月票
                </Button>
              </Card.Footer>
            </Box>
          </Card.Root>
          <Card.Root flexDirection="row" overflow="hidden" maxW="xl">
            <Image
              objectFit="cover"
              maxW="200px"
              src="2.png"
              alt="Caffe Latte"
            />
            <Box>
              <Card.Body>
                <Card.Title mb="2">緊急通報電話</Card.Title>
                <Card.Description>
                  軌道、平交道、橋梁、隧道等設施發生事故或異常情形時，請立即撥打緊急通報電話。
                </Card.Description>
                <HStack mt="4">
                  <Badge>電話</Badge>
                  <Badge>緊急</Badge>
                </HStack>
              </Card.Body>
              <Card.Footer>
                <Button
                  onClick={() => window.open("https://www.railway.gov.tw/tra-tip-web/adr/customized_info?I=BOdk82vOPKw4nr9W8kfiZqgN%2Bif9LX%2B2JNc1p3BG4HGpGf0rzDC8bMRG3GqlEN4q5Sm8csVG1EI%3D&site_preference=normal", "_blank")}
                >
                  連絡電話
                </Button>
              </Card.Footer>
            </Box>
          </Card.Root>
        </Flex>
        <Flex align="center" gap={4} p={3} bg="blue.50" maxW="container.xl">
          <Card.Root flexDirection="row" overflow="hidden" maxW="xl">
            <Image
              objectFit="cover"
              maxW="200px"
              src={"3.png"}
              alt="Caffe Latte"
            />
            <Box>
              <Card.Body>
                <Card.Title mb="2">鐵路紀念集章活動</Card.Title>
                <Card.Description>
                  參加鐵路紀念集章活動，蒐集各站印章，完成後可兌換精美紀念品。
                </Card.Description>
                <HStack mt="4">
                  <Badge>紀念</Badge>
                  <Badge>印章</Badge>
                </HStack>
              </Card.Body>
              <Card.Footer>
                <Button
                  onClick={() => window.open("https://www.seiburailway.jp/sightseeing/eventcampaigninfo/japantaiwan_stamprally/#sec1", "_blank")}
                >
                  活動連結
                </Button>
              </Card.Footer>
            </Box>
          </Card.Root>
          <Card.Root flexDirection="row" overflow="hidden" maxW="xl">
            <Image
              objectFit="cover"
              maxW="200px"
              src="4.png"
              alt="Caffe Latte"
            />
            <Box>
              <Card.Body>
                <Card.Title mb="2">台鐵便當預定</Card.Title>
                <Card.Description>
                  提供便當預定服務，讓您在旅途中享受美味便當，請提前預定以確保供應。
                </Card.Description>
                <HStack mt="4">
                  <Badge>便當</Badge>
                  <Badge>預定</Badge>
                </HStack>
              </Card.Body>
              <Card.Footer>
                <Button
                  onClick={() => window.open("https://www.railway.gov.tw/tra-tip-web/tip/tip004/tip421/entry", "_blank")}
                >
                  便當預定
                </Button>
              </Card.Footer>
            </Box>
          </Card.Root>
        </Flex>
        <Heading m={4} className="text-3xl font-bold text-blue-700 mb-2">歡迎使用台鐵時刻表</Heading>
        <Heading className="text-blue-600 text-lg mb-4">查詢最新台鐵班次、時刻與車站資訊，簡單快速。</Heading>
      </Flex>
    </Box>
  );
};

export default Home;
