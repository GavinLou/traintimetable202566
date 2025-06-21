import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Trainmap from "./pages/Trainmap";
import Stationmap from "./pages/Stationmap";
import Information from "./pages/Information";
import Buyticket from "./pages/Buyticket";

import { RiLoginBoxLine } from "react-icons/ri"
import { Heading, Select, createListCollection, Container, Portal, Image, Flex, Button, Tabs, Box } from "@chakra-ui/react";
import { useState } from "react"

function TabNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // 根據目前路徑決定預設 Tab
  const tabIndex = ["/", "/buyticket", "/trainmap", "/search", "/stationmap", "/informaion"].indexOf(location.pathname.toLowerCase());

  return (
    <Tabs.Root value={["tab-1", "tab-2", "tab-3", "tab-4", "tab-5", "tab-6"][tabIndex === -1 ? 0 : tabIndex]} w="100%" variant="enclosed" fitted defaultValue={"tab-1"}>
      <Tabs.List>
        <Tabs.Trigger value="tab-1" onClick={() => navigate("/")}>首頁</Tabs.Trigger>
        <Tabs.Trigger value="tab-2" onClick={() => navigate("/buyticket")}>購票</Tabs.Trigger>
        <Tabs.Trigger value="tab-3" onClick={() => navigate("/trainmap")}>台鐵地圖</Tabs.Trigger>
        <Tabs.Trigger value="tab-4" onClick={() => navigate("/search")}>查詢班表</Tabs.Trigger>
        <Tabs.Trigger value="tab-5" onClick={() => navigate("/stationmap")}>車站地圖</Tabs.Trigger>
        <Tabs.Trigger value="tab-6" onClick={() => navigate("/informaion")}>關於網頁</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
}

function App() {
  const [value, setValue] = useState<string[]>([frameworks.items[0].value])
  return (
    <Router>
      <Box minH="100vh">
        <Container>
          <Box maxW="container.xl" p={10} bg="blackAlpha.200" boxShadow="md" borderRadius="md">
            <Flex align="center" gap={4} justify="space-between">
              <Flex align="center" gap={4}>
                <Image
                  width={"50px"}
                  height={"50px"}
                  src="public\ROC_Taiwan_Railways_Administration_Logo.svg.png"
                />
                <Heading>台灣鐵路</Heading>
              </Flex>
              <Flex align="center" gap={4}>
                <Select.Root collection={frameworks} width="150px" value={value} onValueChange={(e) => setValue(e.value)}>
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select framework" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {frameworks.items.map((framework) => (
                          <Select.Item item={framework} key={framework.value}>
                            {framework.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
                <Button colorScheme="teal" variant="outline">
                  Log in <RiLoginBoxLine />
                </Button>
              </Flex>
            </Flex>
          </Box>
          <Box p={4} bg="whiteAlpha.800" boxShadow="md" borderRadius="md">
            {/* Tabs 導覽列 */}
            <TabNav />
            {/* 主要內容區 */}
            <Box mt={8}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/trainmap" element={<Trainmap />} />
                <Route path="/Stationmap" element={<Stationmap />} />
                <Route path="/information" element={<Information />} />
                <Route path="/buyticket" element={<Buyticket />} />
              </Routes>
            </Box>
          </Box>
        </Container>
      </Box>
    </Router>
  )
}

const frameworks = createListCollection({
  items: [
    { label: "繁體中文", value: "ChineseT" },
    { label: "簡體中文", value: "ChineseZ" },
    { label: "English", value: "English" },
    { label: "日本語", value: "Japanese" },
  ],
})

export default App;