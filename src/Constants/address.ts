import { Environment } from "Types/misc";

export const DAPP_DEFINITION_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "account_tdx_2_129zymzhffm45w5jyccyu9x0tv5xs7qs76zxzrfsd7gn76f7k5reus2"
    : "account_rdx128er8y5hetcj98krndumys93jyerq659ug0uyk6l6ljdtd9mrcevwf";

export const NODE_VALIDATOR_ADDRESS =
  "validator_rdx1swez5cqmw4d6tls0mcldehnfhpxge0mq7cmnypnjz909apqqjgx6n9";

export const NODE_LSU_ADDRESS =
  "resource_rdx1t4d3ka2x2j35e30gh75j6hma6fccwdsft88h2v2ul4qmqshnwjmxf7";

export const RADIX_NODE_OWNER_BADGE_NFT_ADDRESS =
  "resource_rdx1nfxxxxxxxxxxvdrwnrxxxxxxxxx004365253834xxxxxxxxxvdrwnr";
