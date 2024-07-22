import {
  Box,
  Checkbox,
  Stack,
  Heading,
  Text,
  Link,
  Flex,
  Button,
} from "@chakra-ui/react";
import dummy from "./json/dummuElements.json";
import elements from "./json/htmlElements.json";
import { useState } from "react";

const shuffle = <T,>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

type Data =
  | { name: string }
  | {
      name: string;
      ja: string;
      en: string;
      specification: string;
      mdnJa: string;
      mdnEn: string;
    };

const selectData: Data[] = shuffle([...dummy, ...elements]);

const getI18n = (isJa: boolean, ja: string, en: string) => (isJa ? ja : en);

const CheckResult = ({
  isJa,
  isChecked,
  data,
}: {
  isJa: boolean;
  isChecked: boolean;
  data: Data;
}) => (
  <Box>
    <Checkbox
      disabled
      size="md"
      colorScheme="green"
      fontSize="md"
      isChecked={isChecked}
      fontWeight={"ja" in data || isChecked ? "bold" : ""}
      color={
        "ja" in data && !isChecked ? "red" : "ja" in data ? "green" : "gray"
      }
    >
      {data.name}
    </Checkbox>
    <Box height={4}>
      {"ja" in data && (
        <Flex gap={2} ml={6} mr={2} fontSize={["xs", "sm"]}>
          <Text flexGrow={1}>{getI18n(isJa, data.ja, data.en)}</Text>
          <Link
            href={isJa ? data.mdnJa : data.mdnEn}
            isExternal
            textDecoration="underline"
          >
            mdn
          </Link>
          <Link href={data.specification} isExternal textDecoration="underline">
            {getI18n(isJa, "仕様書", "spec")}
          </Link>
        </Flex>
      )}
    </Box>
  </Box>
);

export const App = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState<"q" | "a" | "n">("q");
  const isJa = location.pathname !== "/en";

  const handleCheck = (e: string) => {
    if (selected.includes(e)) {
      setSelected((prev) => prev.filter((v) => v !== e));
    } else {
      setSelected((prev) => [...prev, e]);
    }
  };

  const unselectedData = elements.filter((e) => !selected.includes(e.name));
  const selectedDummy = selected.filter((e) => dummy.some((v) => v.name === e));
  const score = Math.max(
    selected.filter((e) => elements.some((v) => v.name === e)).length -
      selectedDummy.length,
    0
  );

  return (
    <Box bg="#eeeeee" p={4}>
      <Stack mx="auto" px={2} py={2} maxW={640} bg="#ffffff" gap={4}>
        <Heading as="h1" fontWeight="bold" py={[2, 4]} size={["xs", "md"]}>
          {getI18n(
            isJa,
            "実在するhtml要素を全部選んでください.com",
            "select-all-html.com"
          )}
        </Heading>
        <Flex
          alignItems="center"
          justifyContent="right"
          gap={4}
          fontSize={["xs", "sm"]}
          p={2}
          position="sticky"
          top={1}
          bgColor="#eeeeeedd"
          zIndex={1}
        >
          {mode === "q" && (
            <Text>
              {getI18n(isJa, "選択", "Selected")}:{selected.length}/114
            </Text>
          )}
          {(mode === "a" || mode === "n") && (
            <Text>
              {getI18n(isJa, "スコア", "Score")}:{score}/114
            </Text>
          )}
          <Button
            onClick={() => setMode((prev) => (prev === "q" ? "a" : "q"))}
            size={["xs", "sm"]}
            colorScheme="teal"
          >
            {mode === "q"
              ? getI18n(isJa, "回答する", "Answer")
              : getI18n(isJa, "選択に戻る", "Back")}
          </Button>
          {(mode === "a" || mode === "n") && (
            <Button
              onClick={() => {
                window.scroll({
                  top: 0,
                  behavior: "instant",
                });
                setMode("n");
              }}
              size={["xs", "sm"]}
              variant="outline"
              colorScheme="teal"
            >
              {/* 不正解を確認 */}
              {getI18n(isJa, "間違いを確認", "Check incorrect")}
            </Button>
          )}
        </Flex>
        <Text fontSize={["xs", "sm"]}>
          {getI18n(
            isJa,
            "※実在しない要素を選択すると減点されます。",
            "* You will be penalized if you select a non-existent element."
          )}
        </Text>
        <Stack gap={4}>
          {selectData.map((e) =>
            mode === "q" ? (
              <Box key={e.name}>
                <Checkbox
                  size="md"
                  colorScheme="green"
                  fontSize="md"
                  isChecked={!!selected.includes(e.name)}
                  onChange={() => handleCheck(e.name)}
                >
                  {e.name}
                </Checkbox>
                <Box height={4} />
              </Box>
            ) : mode === "a" ? (
              <CheckResult
                key={e.name}
                data={e}
                isChecked={selected.includes(e.name)}
                isJa={isJa}
              />
            ) : null
          )}
          {mode === "n" && (
            <>
              <Text
                fontSize={["xs", "sm"]}
                fontWeight="bold"
                textAlign="center"
              >
                {getI18n(isJa, "未選択", "Unselected")} {unselectedData.length}
                {getI18n(isJa, "個", "items")}
              </Text>
              {unselectedData.map((e) => (
                <CheckResult
                  key={e.name}
                  data={e}
                  isChecked={false}
                  isJa={isJa}
                />
              ))}
              <Text
                fontSize={["xs", "sm"]}
                fontWeight="bold"
                textAlign="center"
              >
                {getI18n(isJa, "非実在選択", "Non-existent selected")}{" "}
                {selectedDummy.length}
                {getI18n(isJa, "個", "items")}
              </Text>
              {selectedDummy.map((e) => (
                <CheckResult
                  key={e}
                  data={{ name: e }}
                  isChecked={true}
                  isJa={isJa}
                />
              ))}
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
