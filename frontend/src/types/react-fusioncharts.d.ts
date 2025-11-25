declare module "react-fusioncharts" {
  import * as React from "react";

  interface ReactFusionChartsProps {
    type: string;
    width?: string | number;
    height?: string | number;
    dataFormat?: "json" | "xml";
    dataSource?: any;
    [key: string]: any;
  }

  export default class ReactFusioncharts extends React.Component<ReactFusionChartsProps> {}
}
