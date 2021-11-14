import * as React from 'react';
import styles from './RemoMyTeamPageHeader.module.scss';
import { IRemoMyTeamPageHeaderProps } from './IRemoMyTeamPageHeaderProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class RemoMyTeamPageHeader extends React.Component<IRemoMyTeamPageHeaderProps, {}> {
  public render(): React.ReactElement<IRemoMyTeamPageHeaderProps> {
    return (
      <div className={ styles.remoMyTeamPageHeader }>
        <section>
          <div className="relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">  
                  <div className="inner-banner-overlay"></div>
                  <div className="inner-banner-contents">
                    <h1> My Team </h1>
                    <ul className="breadcums">
                      <li>  <a href={`${this.props.siteurl}/SitePages/Home.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                      <li>  <a href="#" style={{pointerEvents:"none"}}> My Teams </a> </li>
                    </ul>
                  </div>  
                </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
