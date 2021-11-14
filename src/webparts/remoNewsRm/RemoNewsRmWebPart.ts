import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'RemoNewsRmWebPartStrings';
import RemoNewsRm from './components/RemoNewsRm';
import { IRemoNewsRmProps } from './components/IRemoNewsRmProps';

export interface IRemoNewsRmWebPartProps {
  description: string;
}

export default class RemoNewsRmWebPart extends BaseClientSideWebPart<IRemoNewsRmWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IRemoNewsRmProps> = React.createElement(
      RemoNewsRm,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        context: this.context,
        userid: this.context.pageContext.legacyPageContext["userId"],
        siteID: this.context.pageContext.web.id
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
