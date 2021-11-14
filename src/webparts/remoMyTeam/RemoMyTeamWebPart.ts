import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'RemoMyTeamWebPartStrings';
import RemoMyTeam from './components/RemoMyTeam';
import { IRemoMyTeamProps } from './components/IRemoMyTeamProps';

export interface IRemoMyTeamWebPartProps {
  description: string;
}

export default class RemoMyTeamWebPart extends BaseClientSideWebPart<IRemoMyTeamWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IRemoMyTeamProps> = React.createElement(
      RemoMyTeam,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        UserID : this.context.pageContext.legacyPageContext['userId']
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
