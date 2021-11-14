import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'RemoMyPersonalQuickLinkWebPartStrings';
import RemoMyPersonalQuickLink from './components/RemoMyPersonalQuickLink';
import { IRemoMyPersonalQuickLinkProps } from './components/IRemoMyPersonalQuickLinkProps';

export interface IRemoMyPersonalQuickLinkWebPartProps {
  description: string;
}

export default class RemoMyPersonalQuickLinkWebPart extends BaseClientSideWebPart<IRemoMyPersonalQuickLinkWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IRemoMyPersonalQuickLinkProps> = React.createElement(
      RemoMyPersonalQuickLink,
      {
        description: this.properties.description,
        siteurl:this.context.pageContext.web.absoluteUrl,
        context: this.context,
        userid: this.context.pageContext.legacyPageContext["userId"]
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
